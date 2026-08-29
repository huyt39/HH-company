"""FastAPI entry point.

Owns the connection lifecycle, middleware, central error handling and router
wiring. Business logic lives in `src/services`, queries in `src/repositories`.
"""

import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from src.configs import app_config, security_config, storage_config
from src.routers import main_router
from src.services import MongoDatabase, SeedService
from src.types import BaseApiResponse
from src.utils import Logger

logger = Logger("main")


def _job_id_of(request: Request) -> str:
    return getattr(request.state, "job_id", None) or str(uuid.uuid4())


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Open connections on startup, close them on shutdown."""
    logger.info(f"Starting {app_config.APP_NAME} ({app_config.ENVIRONMENT})")

    if security_config.has_placeholder_secret:
        message = "SECRET_KEY is still the placeholder — tokens can be forged."
        if app_config.is_production:
            raise RuntimeError(f"{message} Set a real SECRET_KEY before running production.")
        logger.warning(message)

    database = MongoDatabase()
    await database.connect()
    app.state.mongo = database

    await SeedService().run()
    logger.info("Startup complete")

    yield

    await database.close()
    logger.info("Shutdown complete")


app = FastAPI(
    title=app_config.APP_NAME,
    description="API cho website giới thiệu công ty",
    version=app_config.VERSION,
    docs_url=app_config.DOCS_URL,
    redoc_url=app_config.REDOC_URL,
    openapi_url=app_config.OPENAPI_URL,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=app_config.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_job_id(request: Request, call_next):
    """Tag each request with an id so logs and error responses can be traced."""
    request.state.job_id = str(uuid.uuid4())
    return await call_next(request)


# --------------------------------------------------------------------------- #
# Central error handling — every failure returns the same envelope
# --------------------------------------------------------------------------- #

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    job_id = _job_id_of(request)
    logger.warning(f"[{job_id}] {request.method} {request.url.path} → {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=BaseApiResponse(
            success=False, detail=str(exc.detail), data={"job_id": job_id}
        ).model_dump(),
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    job_id = _job_id_of(request)

    # `ctx` may hold non-serialisable objects (e.g. ValueError) — stringify it.
    errors = []
    for error in exc.errors():
        clean = {key: value for key, value in error.items() if key != "ctx"}
        if error.get("ctx"):
            clean["ctx"] = {key: str(value) for key, value in error["ctx"].items()}
        errors.append(clean)

    logger.warning(f"[{job_id}] Invalid request body: {errors}")
    return JSONResponse(
        status_code=422,
        content=BaseApiResponse(
            success=False,
            detail="Dữ liệu gửi lên không hợp lệ",
            data={"job_id": job_id, "validation_errors": errors},
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    job_id = _job_id_of(request)
    logger.error(f"[{job_id}] Unhandled error: {type(exc).__name__}: {exc}", exc_info=True)

    # Never leak internals in production; look the job_id up in the logs.
    detail = "Lỗi hệ thống" if app_config.is_production else f"Lỗi hệ thống: {exc}"
    return JSONResponse(
        status_code=500,
        content=BaseApiResponse(success=False, detail=detail, data={"job_id": job_id}).model_dump(),
    )


app.include_router(main_router, prefix=app_config.API_V1_PREFIX)

# Uploaded images are served statically when running locally. On Vercel they
# live in Blob Storage behind absolute URLs, so no mount is needed.
if not storage_config.use_blob:
    upload_dir = storage_config.upload_path
    upload_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")


@app.get("/health", tags=["Hệ thống"])
async def health() -> dict:
    """Liveness probe for uptime monitors."""
    return {"status": "ok", "environment": app_config.ENVIRONMENT}

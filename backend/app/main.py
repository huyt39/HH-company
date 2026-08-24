import logging
from contextlib import asynccontextmanager
from pathlib import Path

import beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.seed import init_db
from app.db.session import close_motor_client, get_motor_database
from app.models import (
    BusinessField,
    ContactMessage,
    FinancialYear,
    JobPosting,
    NewsItem,
    Partner,
    Product,
    Project,
    Setting,
    User,
)

logger = logging.getLogger("uvicorn.error")

DOCUMENT_MODELS = [
    User,
    Setting,
    BusinessField,
    Product,
    Project,
    NewsItem,
    JobPosting,
    FinancialYear,
    Partner,
    ContactMessage,
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi tạo Beanie — phải gọi trước khi dùng bất kỳ Document nào.
    database = get_motor_database()
    await beanie.init_beanie(database=database, document_models=DOCUMENT_MODELS)

    await init_db()

    if settings.SECRET_KEY == "doi-chuoi-nay-truoc-khi-deploy":
        message = "SECRET_KEY đang là giá trị mặc định — token đăng nhập có thể bị giả mạo."
        if settings.is_production:
            raise RuntimeError(f"{message} Đặt SECRET_KEY thật trước khi chạy production.")
        logger.warning("⚠️  %s", message)

    yield

    await close_motor_client()


app = FastAPI(
    title=settings.APP_NAME,
    description="API cho website giới thiệu công ty",
    version="0.3.0",
    docs_url="/docs",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Ảnh do admin tải lên — phục vụ tĩnh, ai cũng xem được.
upload_dir = settings.upload_path
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")


@app.get("/health", tags=["system"])
def health() -> dict:
    return {"status": "ok", "environment": settings.ENVIRONMENT}

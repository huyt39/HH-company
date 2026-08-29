from src.configs.base import EnvConfig


class AppConfig(EnvConfig):
    """FastAPI application settings."""

    ENVIRONMENT: str = "development"

    APP_NAME: str = "Hoa Hoang Intra"
    VERSION: str = "1.0.0"
    APP_PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"

    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() in {"production", "prod"}

    @property
    def DOCS_URL(self) -> str:
        return "/docs"

    @property
    def REDOC_URL(self) -> str:
        return "/redoc"

    @property
    def OPENAPI_URL(self) -> str:
        return f"{self.API_V1_PREFIX}/openapi.json"

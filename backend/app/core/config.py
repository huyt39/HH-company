from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# .../backend — neo mọi đường dẫn tương đối vào đây để script chạy từ thư mục
# nào cũng trỏ đúng file, không tạo nhầm database rỗng ở chỗ khác.
BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "Hoa Hoang Intra"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "company_db"

    UPLOAD_DIR: str = "./data/uploads"

    SECRET_KEY: str = "doi-chuoi-nay-truoc-khi-deploy"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    ADMIN_EMAIL: str = "admin@hoahoang.vn"
    ADMIN_PASSWORD: str = ""

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() in {"production", "prod"}

    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        return path if path.is_absolute() else (BACKEND_ROOT / path).resolve()


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

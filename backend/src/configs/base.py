"""Shared base for every settings class.

All configs read the same `.env` next to `backend/`, so uvicorn and scripts
pick up the same environment no matter which directory they run from.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# .../backend
BASE_DIR = Path(__file__).resolve().parents[2]


class EnvConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

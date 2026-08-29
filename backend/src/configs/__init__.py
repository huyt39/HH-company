"""Application settings.

One `BaseSettings` class per concern, instantiated once here and shared, so
`.env` is not re-read by every module.
"""

from src.configs.app import AppConfig
from src.configs.base import BASE_DIR, EnvConfig
from src.configs.constants import PARTNER_ROLE, PROJECT_STATUS, SETTING_KEY
from src.configs.mongo import MongoConfig
from src.configs.security import PLACEHOLDER_SECRET_KEY, SecurityConfig
from src.configs.storage import StorageConfig

app_config = AppConfig()
mongo_config = MongoConfig()
security_config = SecurityConfig()
storage_config = StorageConfig()

__all__ = [
    "BASE_DIR",
    "EnvConfig",
    "AppConfig",
    "MongoConfig",
    "SecurityConfig",
    "StorageConfig",
    "PLACEHOLDER_SECRET_KEY",
    "SETTING_KEY",
    "PROJECT_STATUS",
    "PARTNER_ROLE",
    "app_config",
    "mongo_config",
    "security_config",
    "storage_config",
]

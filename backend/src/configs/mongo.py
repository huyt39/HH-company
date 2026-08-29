from src.configs.base import EnvConfig


class MongoConfig(EnvConfig):
    """MongoDB connection settings."""

    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "company_db"

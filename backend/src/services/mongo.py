"""MongoDB connection and Beanie initialisation."""

import beanie
import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from src.configs import MongoConfig, mongo_config
from src.models import DOCUMENT_MODELS
from src.utils import Logger

logger = Logger("mongo_database")

# Atlas (mongodb+srv) requires TLS. Point the driver at certifi's CA bundle
# rather than the host store, which macOS Python images ship empty.
TLS_SCHEME = "mongodb+srv://"


class MongoDatabase:
    """MongoDB connection lifecycle: connect, use, close."""

    def __init__(self, config: MongoConfig | None = None) -> None:
        self.config = config or mongo_config
        self.client: AsyncIOMotorClient | None = None
        self.db: AsyncIOMotorDatabase | None = None

    async def connect(self) -> AsyncIOMotorDatabase:
        """Open the connection, verify with a ping, then init Beanie."""
        options = {}
        if self.config.MONGODB_URL.startswith(TLS_SCHEME):
            options["tlsCAFile"] = certifi.where()

        try:
            self.client = AsyncIOMotorClient(self.config.MONGODB_URL, **options)
            self.db = self.client.get_database(self.config.MONGODB_DB_NAME)
            await self.client.admin.command("ping")
        except Exception as exc:
            logger.error("Could not connect to MongoDB", exc_info=True)
            raise ConnectionError(f"Could not connect to MongoDB: {exc}") from exc

        # Beanie must be initialised before any Document is used.
        await beanie.init_beanie(database=self.db, document_models=DOCUMENT_MODELS)
        logger.info(f"Connected to MongoDB: {self.config.MONGODB_DB_NAME}")
        return self.db

    async def close(self) -> None:
        if self.client is not None:
            self.client.close()
            self.client = None
            self.db = None
            logger.info("Closed MongoDB connection.")

    def get_database(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        return self.db

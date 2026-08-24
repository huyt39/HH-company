"""Kết nối MongoDB qua Motor client.

Không còn dùng SQLAlchemy Session. Beanie quản lý connection pool toàn cục.
`get_db` được giữ lại như no-op dependency để tránh phải sửa tất cả chữ ký
hàm cùng lúc — sẽ xoá dần khi refactor tiếp.
"""

import motor.motor_asyncio

from app.core.config import settings

_client: motor.motor_asyncio.AsyncIOMotorClient | None = None


def get_motor_client() -> motor.motor_asyncio.AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    return _client


def get_motor_database() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    return get_motor_client()[settings.MONGODB_DB_NAME]


async def close_motor_client() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None

from typing import Any

from src.models import Setting
from src.repositories.base import BaseRepository


class SettingRepository(BaseRepository[Setting]):
    """Key/value store for singleton data."""

    model = Setting

    async def get_value(self, key: str) -> dict[str, Any] | None:
        row = await self.find_one({"key": key})
        return row.value if row else None

    async def set_value(self, key: str, value: dict[str, Any]) -> dict[str, Any]:
        row = await self.find_one({"key": key})
        if row is None:
            await self.create({"key": key, "value": value})
        else:
            await self.update(row, {"value": value})
        return value

    async def has_key(self, key: str) -> bool:
        return await self.exists({"key": key})

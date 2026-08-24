from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class BaseDocument(Document):
    """Base cho mọi Beanie Document — tự thêm created_at / updated_at."""

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    async def save(self, *args, **kwargs):  # type: ignore[override]
        self.updated_at = utcnow()
        return await super().save(*args, **kwargs)

    class Settings:
        use_revision = False

"""Base class for every Beanie document."""

from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class BaseDocument(Document):
    """Keeps `created_at` / `updated_at` current for every collection."""

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    async def save(self, *args, **kwargs):  # type: ignore[override]
        self.updated_at = utcnow()
        return await super().save(*args, **kwargs)

    class Settings:
        use_revision = False


class PublishableDocument(BaseDocument):
    """A document that can be hidden and ordered by hand on the public site."""

    sort_order: int = 0
    is_published: bool = True

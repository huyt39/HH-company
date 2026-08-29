from typing import Any

from beanie import Indexed

from src.models.base import PublishableDocument


class BusinessField(PublishableDocument):
    """A line of business the company operates in."""

    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    description: str | None = None
    icon: str | None = None
    cover: dict[str, Any] | None = None

    class Settings:
        name = "business_fields"

from datetime import date
from typing import Any

from beanie import Indexed

from src.models.base import PublishableDocument


class NewsItem(PublishableDocument):
    """A news article."""

    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    title: str
    excerpt: str | None = None
    content: str | None = None
    category: str | None = None
    cover: dict[str, Any] | None = None
    published_at: date | None = None

    class Settings:
        name = "news"

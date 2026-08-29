from typing import Any

from beanie import Indexed
from pydantic import Field

from src.models.base import PublishableDocument


class Project(PublishableDocument):
    """A delivered or ongoing project."""

    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    summary: str | None = None
    content: str | None = None
    location: str | None = None
    scale: str | None = None
    investor: str | None = None
    year: int | None = None
    status: str | None = None
    context: str | None = None
    context_source: str | None = None
    cover: dict[str, Any] | None = None
    gallery: list[dict[str, Any]] = Field(default_factory=list)

    class Settings:
        name = "projects"

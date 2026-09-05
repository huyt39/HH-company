from typing import Any

from beanie import Indexed
from pydantic import Field

from src.models.base import PublishableDocument


class Product(PublishableDocument):
    """A product group the company supplies."""

    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    description: str | None = None
    specs: list[str] = Field(default_factory=list)
    applications: list[str] = Field(default_factory=list)
    icon: str | None = None
    image: dict[str, Any] | None = None

    class Settings:
        name = "products"

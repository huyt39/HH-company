from typing import Any

from src.models.base import PublishableDocument


class Partner(PublishableDocument):
    """A customer or a manufacturer the company works with."""

    name: str
    country: str | None = None
    role: str | None = None
    logo: dict[str, Any] | None = None

    class Settings:
        name = "partners"

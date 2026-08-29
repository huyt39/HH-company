from typing import Any

from beanie import Indexed
from pydantic import Field

from src.models.base import BaseDocument


class Setting(BaseDocument):
    """Key/value store for singletons: company profile, contact info."""

    key: Indexed(str, unique=True)  # type: ignore[valid-type]
    value: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "settings"

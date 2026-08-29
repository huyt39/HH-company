from beanie import Indexed

from src.models.base import BaseDocument


class User(BaseDocument):
    """Admin account."""

    email: Indexed(str, unique=True)  # type: ignore[valid-type]
    full_name: str | None = None
    password_hash: str
    is_active: bool = True

    class Settings:
        name = "users"

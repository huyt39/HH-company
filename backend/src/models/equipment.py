from typing import Any

from src.models.base import PublishableDocument


class Equipment(PublishableDocument):
    """One line of the construction equipment schedule.

    No quantity: the source documents list equipment types the company works
    with, but nowhere states how many units it owns, so the table shows what
    the plant is and what it does rather than an invented count.
    """

    name: str
    category: str | None = None  # cang-keo | nang-ha | do-kiem | khac
    spec: str | None = None
    note: str | None = None
    image: dict[str, Any] | None = None

    class Settings:
        name = "equipment"

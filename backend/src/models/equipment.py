from typing import Any

from src.models.base import PublishableDocument


class Equipment(PublishableDocument):
    """One line of the construction equipment schedule.

    `quantity` is optional: most source documents list equipment types without
    a count, so the table shows what the plant is and what it does rather than
    an invented number. It is filled in only where a document states it.
    """

    name: str
    category: str | None = None  # cang-keo | nang-ha | do-kiem | khac
    quantity: int | None = None
    spec: str | None = None
    note: str | None = None
    image: dict[str, Any] | None = None

    class Settings:
        name = "equipment"

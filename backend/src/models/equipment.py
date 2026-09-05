from typing import Any

from src.models.base import PublishableDocument


class Equipment(PublishableDocument):
    """One line of the construction equipment schedule.

    `quantity` is nullable on purpose: the public page prints "Đang cập nhật"
    rather than a made-up count until someone fills the real number in.
    """

    name: str
    category: str | None = None  # cang-keo | nang-ha | do-kiem | khac
    spec: str | None = None
    quantity: int | None = None
    unit: str | None = None
    note: str | None = None
    image: dict[str, Any] | None = None

    class Settings:
        name = "equipment"

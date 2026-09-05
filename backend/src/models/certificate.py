from typing import Any

from src.models.base import PublishableDocument


class Certificate(PublishableDocument):
    """A licence, certificate or acceptance letter backing the contractor case.

    Split by `category` so the capability page can show legal standing,
    management systems and client acceptance letters as separate blocks.
    """

    name: str
    category: str | None = None  # legal | iso | acceptance | product
    issuer: str | None = None
    code: str | None = None
    issued: str | None = None  # free text: "16/12/2025", "2025", "Còn hiệu lực"
    note: str | None = None
    image: dict[str, Any] | None = None

    class Settings:
        name = "certificates"

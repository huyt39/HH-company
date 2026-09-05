from typing import Any

from src.models.base import PublishableDocument


class DocumentFile(PublishableDocument):
    """A downloadable file (capability profile, catalogue, method statement).

    `file_url` is a plain string so the admin can paste either an uploaded path
    or an external link without a second storage integration.
    """

    title: str
    category: str | None = None  # profile | catalogue | method | certificate
    description: str | None = None
    file_url: str | None = None
    language: str | None = None  # vi | en | vi-en
    size_label: str | None = None
    cover: dict[str, Any] | None = None

    class Settings:
        name = "documents"

"""Images uploaded from the admin UI."""

from datetime import datetime

from pydantic import BaseModel


class UploadResponse(BaseModel):
    url: str
    thumb: str | None = None
    filename: str
    size: int
    width: int | None = None
    height: int | None = None
    original_size: int | None = None
    saved_percent: int | None = None


class StoredFile(BaseModel):
    url: str
    thumb: str | None = None
    filename: str
    size: int
    modified: datetime

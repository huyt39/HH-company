from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    """Bọc kết quả phân trang dùng chung cho mọi danh sách."""

    items: list[T] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 10


class Media(BaseModel):
    url: str
    alt: str | None = None
    thumb: str | None = Field(default=None, description="Bản thu nhỏ, dùng cho thẻ và danh sách")
    width: int | None = None
    height: int | None = None


class Timestamped(BaseModel):
    created_at: datetime | None = None
    updated_at: datetime | None = None

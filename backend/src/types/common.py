"""Types shared by every endpoint: response envelope, pagination, media."""

from datetime import datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field, create_model

T = TypeVar("T")


class BaseApiResponse(BaseModel, Generic[T]):
    """Standard envelope for every response.

    `success` says whether the request succeeded, `detail` is a human-readable
    message, `data` carries the actual payload.
    """

    success: bool = True
    detail: str = ""
    data: T


class Page(BaseModel, Generic[T]):
    """Paginated result, shared by every list endpoint."""

    items: list[T] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 10
    total_pages: int = 0


class Media(BaseModel):
    """An uploaded image."""

    url: str
    alt: str | None = None
    thumb: str | None = Field(default=None, description="Bản thu nhỏ dùng cho thẻ và danh sách")
    width: int | None = None
    height: int | None = None


class Timestamped(BaseModel):
    created_at: datetime | None = None
    updated_at: datetime | None = None


class AuditedResponse(Timestamped):
    """Admin-facing response: always carries an id and timestamps."""

    id: str

    model_config = {"from_attributes": True}


class PublishFields(BaseModel):
    """Visibility controls shared by every manageable entity."""

    is_published: bool = True
    sort_order: int = 0


class ReorderRequest(BaseModel):
    ids: list[str] = Field(min_length=1, description="Danh sách ObjectId theo thứ tự mong muốn")


class MessageData(BaseModel):
    """Minimal payload for operations that return no entity."""

    message: str = ""


def make_optional(name: str, base: type[BaseModel]) -> type[BaseModel]:
    """Build a PATCH variant where every field is optional and defaults to None.

    Lets the admin UI send only the fields it changed.
    """
    fields: dict[str, Any] = {
        field_name: (field.annotation | None, None)
        for field_name, field in base.model_fields.items()
    }
    return create_model(name, **fields)

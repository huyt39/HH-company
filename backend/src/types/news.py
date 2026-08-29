"""News articles — public and admin types."""

from datetime import date

from pydantic import BaseModel, Field

from src.types.common import AuditedResponse, Media, PublishFields, Timestamped, make_optional


class Category(BaseModel):
    id: str
    slug: str
    name: str


class NewsResponse(Timestamped):
    id: str
    slug: str
    title: str
    excerpt: str | None = None
    content: str | None = None
    cover: Media | None = None
    category: Category | None = None
    published_at: date | None = None


class NewsBase(PublishFields):
    slug: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=500)
    excerpt: str | None = None
    content: str | None = None
    category: str | None = Field(default=None, max_length=120)
    cover: dict | None = None
    published_at: date | None = None


class NewsAdminResponse(NewsBase, AuditedResponse):
    pass


NewsCreate = NewsBase
NewsUpdate = make_optional("NewsUpdate", NewsBase)

"""Product groups — public and admin types."""

from pydantic import BaseModel, Field

from src.types.common import AuditedResponse, Media, PublishFields, make_optional


class ProductResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: str | None = None
    specs: list[str] = Field(default_factory=list)
    applications: list[str] = Field(default_factory=list)
    icon: str | None = None
    image: Media | None = None


class ProductBase(PublishFields):
    slug: str = Field(min_length=1, max_length=120)
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    specs: list[str] = Field(default_factory=list)
    applications: list[str] = Field(default_factory=list)
    icon: str | None = Field(default=None, max_length=16)
    image: Media | None = None


class ProductAdminResponse(ProductBase, AuditedResponse):
    pass


ProductCreate = ProductBase
ProductUpdate = make_optional("ProductUpdate", ProductBase)

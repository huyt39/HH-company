"""Construction services — public and admin types."""

from pydantic import BaseModel, Field

from src.types.common import AuditedResponse, Media, PublishFields, make_optional


class BusinessFieldResponse(BaseModel):
    """Public view — never exposes publishing state."""

    id: str
    slug: str
    name: str
    summary: str | None = None
    description: str | None = None
    category: str | None = Field(default=None, description="build | repair | technology")
    process_steps: list[str] = Field(default_factory=list)
    standards: list[str] = Field(default_factory=list)
    deliverables: list[str] = Field(default_factory=list)
    work_type: str | None = None
    icon: str | None = None
    cover: Media | None = None


class BusinessFieldBase(PublishFields):
    slug: str = Field(min_length=1, max_length=120)
    name: str = Field(min_length=1, max_length=255)
    summary: str | None = None
    description: str | None = None
    category: str | None = Field(default=None, description="build | repair | technology")
    process_steps: list[str] = Field(default_factory=list)
    standards: list[str] = Field(default_factory=list)
    deliverables: list[str] = Field(default_factory=list)
    work_type: str | None = None
    icon: str | None = Field(default=None, max_length=16)
    cover: dict | None = None


class BusinessFieldAdminResponse(BusinessFieldBase, AuditedResponse):
    pass


BusinessFieldCreate = BusinessFieldBase
BusinessFieldUpdate = make_optional("BusinessFieldUpdate", BusinessFieldBase)

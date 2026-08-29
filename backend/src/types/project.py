"""Projects — public and admin types."""

from pydantic import Field

from src.types.common import AuditedResponse, Media, PublishFields, Timestamped, make_optional


class ProjectResponse(Timestamped):
    id: str
    slug: str
    name: str
    summary: str | None = None
    content: str | None = None
    location: str | None = None
    scale: str | None = Field(default=None, description="Khối lượng / quy mô cung cấp")
    investor: str | None = Field(default=None, description="Khách hàng / nhà thầu chính")
    year: int | None = None
    status: str | None = Field(default=None, description="planning | in_progress | completed")
    context: str | None = Field(
        default=None, description="Bối cảnh dự án tổng hợp từ nguồn tin công khai"
    )
    context_source: str | None = Field(default=None, description="URL nguồn của phần bối cảnh")
    cover: Media | None = None
    gallery: list[Media] = Field(default_factory=list)


class ProjectBase(PublishFields):
    slug: str = Field(min_length=1, max_length=160)
    name: str = Field(min_length=1, max_length=500)
    summary: str | None = None
    content: str | None = None
    location: str | None = None
    scale: str | None = None
    investor: str | None = None
    year: int | None = Field(default=None, ge=1900, le=2200)
    status: str | None = Field(default=None, description="planning | in_progress | completed")
    context: str | None = None
    context_source: str | None = None
    cover: dict | None = None
    gallery: list[dict] = Field(default_factory=list)


class ProjectAdminResponse(ProjectBase, AuditedResponse):
    pass


ProjectCreate = ProjectBase
ProjectUpdate = make_optional("ProjectUpdate", ProjectBase)

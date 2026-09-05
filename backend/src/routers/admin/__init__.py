"""Admin routers. Every endpoint requires login."""

from dataclasses import dataclass, field
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from src.repositories import (
    BusinessFieldRepository,
    CertificateRepository,
    DocumentRepository,
    EquipmentRepository,
    FinancialYearRepository,
    JobPostingRepository,
    NewsRepository,
    PartnerRepository,
    ProductRepository,
    ProjectRepository,
)
from src.repositories.base import BaseRepository
from src.routers.admin import messages, settings, uploads
from src.routers.admin.crud_factory import build_crud_router
from src.types import (
    BusinessFieldAdminResponse,
    BusinessFieldCreate,
    BusinessFieldUpdate,
    CertificateAdminResponse,
    CertificateCreate,
    CertificateUpdate,
    DocumentAdminResponse,
    DocumentCreate,
    DocumentUpdate,
    EquipmentAdminResponse,
    EquipmentCreate,
    EquipmentUpdate,
    FinancialAdminResponse,
    FinancialCreate,
    FinancialUpdate,
    JobAdminResponse,
    JobCreate,
    JobUpdate,
    NewsAdminResponse,
    NewsCreate,
    NewsUpdate,
    PartnerAdminResponse,
    PartnerCreate,
    PartnerUpdate,
    ProductAdminResponse,
    ProductCreate,
    ProductUpdate,
    ProjectAdminResponse,
    ProjectCreate,
    ProjectUpdate,
)


@dataclass(frozen=True)
class CrudResource:
    """One admin resource driven by the shared CRUD factory."""

    path: str
    label: str
    tag: str
    repository: type[BaseRepository]
    create_schema: type[BaseModel]
    update_schema: type[BaseModel]
    response_schema: type[BaseModel]
    # Financials are ordered by year, so they have no drag-to-reorder.
    sortable: bool = True
    extra: dict[str, Any] = field(default_factory=dict)


CRUD_RESOURCES: list[CrudResource] = [
    CrudResource(
        path="fields",
        label="lĩnh vực",
        tag="Quản trị · Lĩnh vực",
        repository=BusinessFieldRepository,
        create_schema=BusinessFieldCreate,
        update_schema=BusinessFieldUpdate,
        response_schema=BusinessFieldAdminResponse,
    ),
    CrudResource(
        path="products",
        label="sản phẩm",
        tag="Quản trị · Sản phẩm",
        repository=ProductRepository,
        create_schema=ProductCreate,
        update_schema=ProductUpdate,
        response_schema=ProductAdminResponse,
    ),
    CrudResource(
        path="projects",
        label="dự án",
        tag="Quản trị · Dự án",
        repository=ProjectRepository,
        create_schema=ProjectCreate,
        update_schema=ProjectUpdate,
        response_schema=ProjectAdminResponse,
    ),
    CrudResource(
        path="news",
        label="tin tức",
        tag="Quản trị · Tin tức",
        repository=NewsRepository,
        create_schema=NewsCreate,
        update_schema=NewsUpdate,
        response_schema=NewsAdminResponse,
    ),
    CrudResource(
        path="careers",
        label="tin tuyển dụng",
        tag="Quản trị · Tuyển dụng",
        repository=JobPostingRepository,
        create_schema=JobCreate,
        update_schema=JobUpdate,
        response_schema=JobAdminResponse,
    ),
    CrudResource(
        path="financials",
        label="số liệu tài chính",
        tag="Quản trị · Tài chính",
        repository=FinancialYearRepository,
        create_schema=FinancialCreate,
        update_schema=FinancialUpdate,
        response_schema=FinancialAdminResponse,
        sortable=False,
    ),
    CrudResource(
        path="certificates",
        label="chứng chỉ",
        tag="Quản trị · Chứng chỉ",
        repository=CertificateRepository,
        create_schema=CertificateCreate,
        update_schema=CertificateUpdate,
        response_schema=CertificateAdminResponse,
    ),
    CrudResource(
        path="equipment",
        label="thiết bị",
        tag="Quản trị · Thiết bị",
        repository=EquipmentRepository,
        create_schema=EquipmentCreate,
        update_schema=EquipmentUpdate,
        response_schema=EquipmentAdminResponse,
    ),
    CrudResource(
        path="documents",
        label="tài liệu",
        tag="Quản trị · Tài liệu",
        repository=DocumentRepository,
        create_schema=DocumentCreate,
        update_schema=DocumentUpdate,
        response_schema=DocumentAdminResponse,
    ),
    CrudResource(
        path="partners",
        label="đối tác",
        tag="Quản trị · Đối tác",
        repository=PartnerRepository,
        create_schema=PartnerCreate,
        update_schema=PartnerUpdate,
        response_schema=PartnerAdminResponse,
    ),
]

admin_router = APIRouter(prefix="/admin")

admin_router.include_router(settings.router)
admin_router.include_router(messages.router)
admin_router.include_router(uploads.router)

for resource in CRUD_RESOURCES:
    admin_router.include_router(
        build_crud_router(
            repository_class=resource.repository,
            create_schema=resource.create_schema,
            update_schema=resource.update_schema,
            response_schema=resource.response_schema,
            label=resource.label,
            sortable=resource.sortable,
        ),
        prefix=f"/{resource.path}",
        tags=[resource.tag],
    )

__all__ = ["admin_router", "CRUD_RESOURCES", "CrudResource"]

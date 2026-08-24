from fastapi import APIRouter

from app.api.v1.admin import messages, settings, uploads
from app.api.v1.admin.crud import build_crud_router
from app.models import BusinessField, FinancialYear, JobPosting, NewsItem, Partner, Product, Project
from app.schemas import admin as s

admin_router = APIRouter()

admin_router.include_router(settings.router, prefix="/settings", tags=["admin: cài đặt"])
admin_router.include_router(messages.router, prefix="/messages", tags=["admin: hộp thư"])
admin_router.include_router(uploads.router, prefix="/uploads", tags=["admin: ảnh"])

# Bảy thực thể dùng chung một factory CRUD.
# default_order là list[tuple[field_name, direction]] — 1=asc, -1=desc
_RESOURCES = [
    (
        "fields",
        "admin: lĩnh vực",
        dict(
            model=BusinessField,
            create_schema=s.BusinessFieldCreate,
            update_schema=s.BusinessFieldUpdate,
            out_schema=s.BusinessFieldOut,
            default_order=(("sort_order", 1), ("_id", 1)),
            searchable=("name", "slug"),
        ),
    ),
    (
        "products",
        "admin: sản phẩm",
        dict(
            model=Product,
            create_schema=s.ProductCreate,
            update_schema=s.ProductUpdate,
            out_schema=s.ProductOut,
            default_order=(("sort_order", 1), ("_id", 1)),
            searchable=("name", "slug"),
        ),
    ),
    (
        "projects",
        "admin: dự án",
        dict(
            model=Project,
            create_schema=s.ProjectCreate,
            update_schema=s.ProjectUpdate,
            out_schema=s.ProjectOut,
            default_order=(("sort_order", 1), ("_id", 1)),
            searchable=("name", "slug", "location", "investor"),
        ),
    ),
    (
        "news",
        "admin: tin tức",
        dict(
            model=NewsItem,
            create_schema=s.NewsCreate,
            update_schema=s.NewsUpdate,
            out_schema=s.NewsOut,
            default_order=(("published_at", -1), ("_id", -1)),
            searchable=("title", "slug"),
        ),
    ),
    (
        "careers",
        "admin: tuyển dụng",
        dict(
            model=JobPosting,
            create_schema=s.JobCreate,
            update_schema=s.JobUpdate,
            out_schema=s.JobOut,
            default_order=(("sort_order", 1), ("_id", -1)),
            searchable=("title", "slug", "department"),
        ),
    ),
    (
        "financials",
        "admin: tài chính",
        dict(
            model=FinancialYear,
            create_schema=s.FinancialCreate,
            update_schema=s.FinancialUpdate,
            out_schema=s.FinancialOut,
            pk="year",
            default_order=(("year", 1),),
            sortable=False,  # bảng này không có sort_order, xếp theo năm
        ),
    ),
    (
        "partners",
        "admin: đối tác",
        dict(
            model=Partner,
            create_schema=s.PartnerCreate,
            update_schema=s.PartnerUpdate,
            out_schema=s.PartnerOut,
            default_order=(("sort_order", 1), ("_id", 1)),
            searchable=("name", "country"),
        ),
    ),
]

for prefix, tag, config in _RESOURCES:
    admin_router.include_router(build_crud_router(**config), prefix=f"/{prefix}", tags=[tag])

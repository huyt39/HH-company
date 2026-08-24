"""Tầng truy vấn dữ liệu — đọc từ MongoDB qua Beanie.

Public API chỉ trả về bản ghi đã publish (`is_published`). Nội dung khởi tạo
lấy từ `seed_data.py` qua `app/db/seed.py`, sau đó admin sửa trực tiếp trên DB.
"""

from app.db.seed import COMPANY_PROFILE_KEY, CONTACT_INFO_KEY
from app.models import (
    BusinessField as BusinessFieldRow,
    FinancialYear as FinancialYearRow,
    JobPosting as JobPostingRow,
    NewsItem as NewsItemRow,
    Partner as PartnerRow,
    Product as ProductRow,
    Project as ProjectRow,
    Setting,
)
from app.schemas.common import Page
from app.schemas.content import (
    BusinessField,
    Category,
    CompanyProfile,
    ContactInfo,
    FinancialYear,
    JobPosting,
    NewsItem,
    Partner,
    Product,
    Project,
)


# --------------------------------------------------------------------------- #
# Tin tức
# --------------------------------------------------------------------------- #

def _to_news(row: NewsItemRow) -> NewsItem:
    return NewsItem(
        id=str(row.id),
        slug=row.slug,
        title=row.title,
        excerpt=row.excerpt,
        content=row.content,
        cover=row.cover,
        category=Category(id="0", slug=row.category, name=row.category) if row.category else None,
        published_at=row.published_at,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


async def list_news(page: int, page_size: int, category: str | None = None) -> Page[NewsItem]:
    find_args = [NewsItemRow.is_published == True]  # noqa: E712
    if category:
        find_args.append(NewsItemRow.category == category)

    query = NewsItemRow.find(*find_args)
    total = await query.count()
    rows = (
        await query.sort([("published_at", -1), ("_id", -1)])
        .skip((page - 1) * page_size)
        .limit(page_size)
        .to_list()
    )
    return Page[NewsItem](items=[_to_news(r) for r in rows], total=total, page=page, page_size=page_size)


async def get_news(slug: str) -> NewsItem | None:
    row = await NewsItemRow.find_one(
        NewsItemRow.slug == slug, NewsItemRow.is_published == True  # noqa: E712
    )
    return _to_news(row) if row else None


# --------------------------------------------------------------------------- #
# Dự án
# --------------------------------------------------------------------------- #

async def list_projects(page: int, page_size: int, status: str | None = None) -> Page[Project]:
    find_args = [ProjectRow.is_published == True]  # noqa: E712
    if status:
        find_args.append(ProjectRow.status == status)

    query = ProjectRow.find(*find_args)
    total = await query.count()
    rows = (
        await query.sort([("sort_order", 1), ("_id", 1)])
        .skip((page - 1) * page_size)
        .limit(page_size)
        .to_list()
    )
    return Page[Project](
        items=[Project.model_validate({**r.model_dump(), "id": str(r.id)}) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


async def get_project(slug: str) -> Project | None:
    row = await ProjectRow.find_one(
        ProjectRow.slug == slug, ProjectRow.is_published == True  # noqa: E712
    )
    return Project.model_validate({**row.model_dump(), "id": str(row.id)}) if row else None


# --------------------------------------------------------------------------- #
# Lĩnh vực, sản phẩm
# --------------------------------------------------------------------------- #

async def list_fields() -> list[BusinessField]:
    rows = (
        await BusinessFieldRow.find(BusinessFieldRow.is_published == True)  # noqa: E712
        .sort([("sort_order", 1), ("_id", 1)])
        .to_list()
    )
    return [BusinessField.model_validate({**r.model_dump(), "id": str(r.id)}) for r in rows]


async def list_products() -> list[Product]:
    rows = (
        await ProductRow.find(ProductRow.is_published == True)  # noqa: E712
        .sort([("sort_order", 1), ("_id", 1)])
        .to_list()
    )
    return [Product.model_validate({**r.model_dump(), "id": str(r.id)}) for r in rows]


async def get_product(slug: str) -> Product | None:
    row = await ProductRow.find_one(
        ProductRow.slug == slug, ProductRow.is_published == True  # noqa: E712
    )
    return Product.model_validate({**row.model_dump(), "id": str(row.id)}) if row else None


# --------------------------------------------------------------------------- #
# Tuyển dụng
# --------------------------------------------------------------------------- #

async def list_jobs(page: int, page_size: int) -> Page[JobPosting]:
    query = JobPostingRow.find(JobPostingRow.is_published == True)  # noqa: E712
    total = await query.count()
    rows = (
        await query.sort([("sort_order", 1), ("_id", -1)])
        .skip((page - 1) * page_size)
        .limit(page_size)
        .to_list()
    )
    return Page[JobPosting](
        items=[JobPosting.model_validate({**r.model_dump(), "id": str(r.id)}) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


async def get_job(slug: str) -> JobPosting | None:
    row = await JobPostingRow.find_one(
        JobPostingRow.slug == slug, JobPostingRow.is_published == True  # noqa: E712
    )
    return JobPosting.model_validate({**row.model_dump(), "id": str(row.id)}) if row else None


# --------------------------------------------------------------------------- #
# Tài chính, đối tác
# --------------------------------------------------------------------------- #

async def list_financials() -> list[FinancialYear]:
    rows = (
        await FinancialYearRow.find(FinancialYearRow.is_published == True)  # noqa: E712
        .sort([("year", 1)])
        .to_list()
    )
    return [FinancialYear.model_validate({**r.model_dump(), "id": str(r.id)}) for r in rows]


async def list_partners(role: str | None = None) -> list[Partner]:
    find_args = [PartnerRow.is_published == True]  # noqa: E712
    if role:
        find_args.append(PartnerRow.role == role)
    rows = (
        await PartnerRow.find(*find_args)
        .sort([("sort_order", 1), ("_id", 1)])
        .to_list()
    )
    return [Partner.model_validate({**r.model_dump(), "id": str(r.id)}) for r in rows]


# --------------------------------------------------------------------------- #
# Hồ sơ công ty (singleton lưu trong collection settings)
# --------------------------------------------------------------------------- #

async def get_company_profile() -> CompanyProfile:
    row = await Setting.find_one(Setting.key == COMPANY_PROFILE_KEY)
    return CompanyProfile.model_validate(row.value) if row else CompanyProfile(name="")


async def get_contact_info() -> ContactInfo:
    row = await Setting.find_one(Setting.key == CONTACT_INFO_KEY)
    return ContactInfo.model_validate(row.value) if row else ContactInfo()

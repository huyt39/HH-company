"""Public content business logic.

Maps database documents to API response types and only ever lets published
records out. Routers do no mapping of their own.
"""

from typing import Any

from src.models.base import BaseDocument
from src.repositories import (
    BusinessFieldRepository,
    FinancialYearRepository,
    JobPostingRepository,
    NewsRepository,
    PartnerRepository,
    ProductRepository,
    ProjectRepository,
)
from src.types import (
    BusinessFieldResponse,
    Category,
    FinancialYearResponse,
    JobResponse,
    NewsResponse,
    Page,
    PartnerResponse,
    ProductResponse,
    ProjectResponse,
)


def _as_dict(doc: BaseDocument) -> dict[str, Any]:
    """Document to dict with a string `id`, ready for `model_validate`."""
    return {**doc.model_dump(), "id": str(doc.id)}


def _page(items: list, total: int, page: int, page_size: int) -> Page:
    total_pages = (total + page_size - 1) // page_size if page_size else 0
    return Page(items=items, total=total, page=page, page_size=page_size, total_pages=total_pages)


class ContentService:
    """Single entry point for all public website content."""

    def __init__(self) -> None:
        self.fields = BusinessFieldRepository()
        self.products = ProductRepository()
        self.projects = ProjectRepository()
        self.news = NewsRepository()
        self.jobs = JobPostingRepository()
        self.financials = FinancialYearRepository()
        self.partners = PartnerRepository()

    # ---- Business fields --------------------------------------------------- #

    async def list_fields(self) -> list[BusinessFieldResponse]:
        rows = await self.fields.list_published()
        return [BusinessFieldResponse.model_validate(_as_dict(r)) for r in rows]

    # ---- Products ---------------------------------------------------------- #

    async def list_products(self) -> list[ProductResponse]:
        rows = await self.products.list_published()
        return [ProductResponse.model_validate(_as_dict(r)) for r in rows]

    async def get_product(self, slug: str) -> ProductResponse | None:
        row = await self.products.get_published_by_slug(slug)
        return ProductResponse.model_validate(_as_dict(row)) if row else None

    # ---- Projects ---------------------------------------------------------- #

    async def list_projects(
        self, *, page: int, page_size: int, status: str | None = None
    ) -> Page[ProjectResponse]:
        rows, total = await self.projects.paginate_published(
            {"status": status} if status else None, page=page, page_size=page_size
        )
        items = [ProjectResponse.model_validate(_as_dict(r)) for r in rows]
        return _page(items, total, page, page_size)

    async def get_project(self, slug: str) -> ProjectResponse | None:
        row = await self.projects.get_published_by_slug(slug)
        return ProjectResponse.model_validate(_as_dict(row)) if row else None

    # ---- News -------------------------------------------------------------- #

    @staticmethod
    def _to_news(doc) -> NewsResponse:
        data = _as_dict(doc)
        # Category is stored as a plain string; wrapped in an object so the
        # frontend needs no change if categories become their own collection.
        data["category"] = (
            Category(id="0", slug=doc.category, name=doc.category) if doc.category else None
        )
        return NewsResponse.model_validate(data)

    async def list_news(
        self, *, page: int, page_size: int, category: str | None = None
    ) -> Page[NewsResponse]:
        rows, total = await self.news.paginate_published(
            {"category": category} if category else None, page=page, page_size=page_size
        )
        return _page([self._to_news(r) for r in rows], total, page, page_size)

    async def get_news(self, slug: str) -> NewsResponse | None:
        row = await self.news.get_published_by_slug(slug)
        return self._to_news(row) if row else None

    # ---- Careers ----------------------------------------------------------- #

    async def list_jobs(self, *, page: int, page_size: int) -> Page[JobResponse]:
        rows, total = await self.jobs.paginate_published(page=page, page_size=page_size)
        items = [JobResponse.model_validate(_as_dict(r)) for r in rows]
        return _page(items, total, page, page_size)

    async def get_job(self, slug: str) -> JobResponse | None:
        row = await self.jobs.get_published_by_slug(slug)
        return JobResponse.model_validate(_as_dict(row)) if row else None

    # ---- Financials and partners ------------------------------------------- #

    async def list_financials(self) -> list[FinancialYearResponse]:
        rows = await self.financials.find_many({"is_published": True})
        return [FinancialYearResponse.model_validate(_as_dict(r)) for r in rows]

    async def list_partners(self, role: str | None = None) -> list[PartnerResponse]:
        rows = await self.partners.list_published({"role": role} if role else None)
        return [PartnerResponse.model_validate(_as_dict(r)) for r in rows]

"""Repositories for the website content collections."""

from src.models import (
    BusinessField,
    Certificate,
    DocumentFile,
    Equipment,
    FinancialYear,
    JobPosting,
    NewsItem,
    Partner,
    Product,
    Project,
)
from src.repositories.base import BaseRepository, PublishableRepository


class BusinessFieldRepository(PublishableRepository[BusinessField]):
    model = BusinessField
    default_sort = (("sort_order", 1), ("_id", 1))
    searchable = ("name", "slug")


class ProductRepository(PublishableRepository[Product]):
    model = Product
    default_sort = (("sort_order", 1), ("_id", 1))
    searchable = ("name", "slug")


class ProjectRepository(PublishableRepository[Project]):
    model = Project
    default_sort = (("sort_order", 1), ("_id", 1))
    searchable = ("name", "slug", "location", "investor")


class NewsRepository(PublishableRepository[NewsItem]):
    model = NewsItem
    default_sort = (("published_at", -1), ("_id", -1))
    searchable = ("title", "slug")


class JobPostingRepository(PublishableRepository[JobPosting]):
    model = JobPosting
    default_sort = (("sort_order", 1), ("_id", -1))
    searchable = ("title", "slug", "department")


class FinancialYearRepository(BaseRepository[FinancialYear]):
    model = FinancialYear
    default_sort = (("year", 1),)


class PartnerRepository(PublishableRepository[Partner]):
    model = Partner
    default_sort = (("sort_order", 1), ("_id", 1))
    searchable = ("name", "country")


class CertificateRepository(PublishableRepository[Certificate]):
    model = Certificate
    default_sort = (("sort_order", 1), ("_id", 1))
    searchable = ("name", "issuer", "code")


class EquipmentRepository(PublishableRepository[Equipment]):
    model = Equipment
    default_sort = (("sort_order", 1), ("_id", 1))
    searchable = ("name", "spec")


class DocumentRepository(PublishableRepository[DocumentFile]):
    model = DocumentFile
    default_sort = (("sort_order", 1), ("_id", 1))
    searchable = ("title", "description")

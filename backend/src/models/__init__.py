"""Database schemas (Beanie documents) — MongoDB collections only.

API request/response types live in `src.types`.
"""

from src.models.base import BaseDocument, PublishableDocument, utcnow
from src.models.business_field import BusinessField
from src.models.contact_message import ContactMessage
from src.models.financial_year import FinancialYear
from src.models.job_posting import JobPosting
from src.models.news_item import NewsItem
from src.models.partner import Partner
from src.models.product import Product
from src.models.project import Project
from src.models.setting import Setting
from src.models.user import User

# Beanie needs the full list at init time (see src/services/mongo.py).
DOCUMENT_MODELS = [
    User,
    Setting,
    BusinessField,
    Product,
    Project,
    NewsItem,
    JobPosting,
    FinancialYear,
    Partner,
    ContactMessage,
]

__all__ = [
    "BaseDocument",
    "PublishableDocument",
    "utcnow",
    "BusinessField",
    "ContactMessage",
    "FinancialYear",
    "JobPosting",
    "NewsItem",
    "Partner",
    "Product",
    "Project",
    "Setting",
    "User",
    "DOCUMENT_MODELS",
]

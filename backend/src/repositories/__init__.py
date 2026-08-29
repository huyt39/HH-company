"""Data access layer. Only this layer knows about Beanie/MongoDB."""

from src.repositories.base import BaseRepository, PublishableRepository
from src.repositories.contact_message import ContactMessageRepository
from src.repositories.content import (
    BusinessFieldRepository,
    FinancialYearRepository,
    JobPostingRepository,
    NewsRepository,
    PartnerRepository,
    ProductRepository,
    ProjectRepository,
)
from src.repositories.setting import SettingRepository
from src.repositories.user import UserRepository

__all__ = [
    "BaseRepository",
    "PublishableRepository",
    "BusinessFieldRepository",
    "ProductRepository",
    "ProjectRepository",
    "NewsRepository",
    "JobPostingRepository",
    "FinancialYearRepository",
    "PartnerRepository",
    "UserRepository",
    "SettingRepository",
    "ContactMessageRepository",
]

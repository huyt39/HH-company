"""Beanie Documents cho toàn bộ collection MongoDB.

Mỗi class tương ứng một collection. ID là PydanticObjectId (MongoDB _id).
Các trường JSON (list, dict) được lưu native trong MongoDB — không cần ép kiểu.
"""

from datetime import date
from typing import Any

from beanie import Indexed
from pydantic import Field

from app.models.base import BaseDocument


# --------------------------------------------------------------------------- #
# User
# --------------------------------------------------------------------------- #

class User(BaseDocument):
    """Tài khoản quản trị."""

    email: Indexed(str, unique=True)  # type: ignore[valid-type]
    full_name: str | None = None
    password_hash: str
    is_active: bool = True

    class Settings:
        name = "users"


# --------------------------------------------------------------------------- #
# Setting (singleton key/value)
# --------------------------------------------------------------------------- #

class Setting(BaseDocument):
    """Cặp key/value cho dữ liệu dạng singleton: hồ sơ công ty, thông tin liên hệ."""

    key: Indexed(str, unique=True)  # type: ignore[valid-type]
    value: dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "settings"


# --------------------------------------------------------------------------- #
# Business Field
# --------------------------------------------------------------------------- #

class BusinessField(BaseDocument):
    __tablename__ = "business_fields"  # kept for reference only

    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    description: str | None = None
    icon: str | None = None
    cover: dict[str, Any] | None = None
    sort_order: int = 0
    is_published: bool = True

    class Settings:
        name = "business_fields"


# --------------------------------------------------------------------------- #
# Product
# --------------------------------------------------------------------------- #

class Product(BaseDocument):
    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    description: str | None = None
    specs: list = Field(default_factory=list)
    applications: list = Field(default_factory=list)
    icon: str | None = None
    sort_order: int = 0
    is_published: bool = True

    class Settings:
        name = "products"


# --------------------------------------------------------------------------- #
# Project
# --------------------------------------------------------------------------- #

class Project(BaseDocument):
    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    summary: str | None = None
    content: str | None = None
    location: str | None = None
    scale: str | None = None
    investor: str | None = None
    year: int | None = None
    status: str | None = None
    context: str | None = None
    context_source: str | None = None
    cover: dict[str, Any] | None = None
    gallery: list = Field(default_factory=list)
    sort_order: int = 0
    is_published: bool = True

    class Settings:
        name = "projects"


# --------------------------------------------------------------------------- #
# NewsItem
# --------------------------------------------------------------------------- #

class NewsItem(BaseDocument):
    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    title: str
    excerpt: str | None = None
    content: str | None = None
    category: str | None = None
    cover: dict[str, Any] | None = None
    published_at: date | None = None
    sort_order: int = 0
    is_published: bool = True

    class Settings:
        name = "news"


# --------------------------------------------------------------------------- #
# JobPosting
# --------------------------------------------------------------------------- #

class JobPosting(BaseDocument):
    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    title: str
    department: str | None = None
    location: str | None = None
    employment_type: str | None = None
    quantity: int = 1
    deadline: date | None = None
    description: str | None = None
    sort_order: int = 0
    is_published: bool = True

    class Settings:
        name = "jobs"


# --------------------------------------------------------------------------- #
# FinancialYear (dùng year làm "key" logic, nhưng _id vẫn là ObjectId)
# --------------------------------------------------------------------------- #

class FinancialYear(BaseDocument):
    year: Indexed(int, unique=True)  # type: ignore[valid-type]
    revenue: int = 0
    profit_after_tax: int = 0
    total_assets: int = 0
    equity: int = 0
    is_published: bool = True

    class Settings:
        name = "financials"


# --------------------------------------------------------------------------- #
# Partner
# --------------------------------------------------------------------------- #

class Partner(BaseDocument):
    name: str
    country: str | None = None
    role: str | None = None
    sort_order: int = 0
    is_published: bool = True

    class Settings:
        name = "partners"


# --------------------------------------------------------------------------- #
# ContactMessage
# --------------------------------------------------------------------------- #

class ContactMessage(BaseDocument):
    """Tin nhắn gửi từ form liên hệ."""

    full_name: str
    email: str
    phone: str | None = None
    subject: str | None = None
    message: str
    is_read: bool = False

    class Settings:
        name = "contact_messages"

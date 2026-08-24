"""Schema cho khu vực quản trị.

Khác schema public ở chỗ có thêm `is_published`, `sort_order` và timestamps.
Mỗi thực thể có 3 biến thể: Base (dùng chung) → Create → Update (partial).

ID bây giờ là chuỗi ObjectId của MongoDB (ví dụ: "64a1b2c3d4e5f6...").
"""

from datetime import date, datetime
from typing import Any, TypeVar

from pydantic import BaseModel, EmailStr, Field, create_model

M = TypeVar("M", bound=BaseModel)


def make_partial(name: str, base: type[BaseModel]) -> type[BaseModel]:
    """Sinh biến thể PATCH: mọi trường thành optional, mặc định None.

    Nhờ vậy admin gửi lên đúng trường muốn sửa, không phải gửi lại cả bản ghi.
    """
    fields: dict[str, Any] = {
        field_name: (field.annotation | None, None)
        for field_name, field in base.model_fields.items()
    }
    return create_model(name, **fields)


class ORMModel(BaseModel):
    model_config = {"from_attributes": True}


class PublishMixin(BaseModel):
    is_published: bool = True
    sort_order: int = 0


class Audit(ORMModel):
    created_at: datetime | None = None
    updated_at: datetime | None = None


# --------------------------------------------------------------------------- #
# Lĩnh vực hoạt động
# --------------------------------------------------------------------------- #

class BusinessFieldBase(PublishMixin):
    slug: str = Field(min_length=1, max_length=120)
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    icon: str | None = Field(default=None, max_length=16)
    cover: dict | None = None


class BusinessFieldOut(BusinessFieldBase, Audit):
    id: str


BusinessFieldCreate = BusinessFieldBase
BusinessFieldUpdate = make_partial("BusinessFieldUpdate", BusinessFieldBase)


# --------------------------------------------------------------------------- #
# Sản phẩm
# --------------------------------------------------------------------------- #

class ProductBase(PublishMixin):
    slug: str = Field(min_length=1, max_length=120)
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    specs: list[str] = Field(default_factory=list)
    applications: list[str] = Field(default_factory=list)
    icon: str | None = Field(default=None, max_length=16)


class ProductOut(ProductBase, Audit):
    id: str


ProductCreate = ProductBase
ProductUpdate = make_partial("ProductUpdate", ProductBase)


# --------------------------------------------------------------------------- #
# Dự án
# --------------------------------------------------------------------------- #

class ProjectBase(PublishMixin):
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


class ProjectOut(ProjectBase, Audit):
    id: str


ProjectCreate = ProjectBase
ProjectUpdate = make_partial("ProjectUpdate", ProjectBase)


# --------------------------------------------------------------------------- #
# Tin tức
# --------------------------------------------------------------------------- #

class NewsBase(PublishMixin):
    slug: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=500)
    excerpt: str | None = None
    content: str | None = None
    category: str | None = Field(default=None, max_length=120)
    cover: dict | None = None
    published_at: date | None = None


class NewsOut(NewsBase, Audit):
    id: str


NewsCreate = NewsBase
NewsUpdate = make_partial("NewsUpdate", NewsBase)


# --------------------------------------------------------------------------- #
# Tuyển dụng
# --------------------------------------------------------------------------- #

class JobBase(PublishMixin):
    slug: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=300)
    department: str | None = None
    location: str | None = None
    employment_type: str | None = None
    quantity: int = Field(default=1, ge=1)
    deadline: date | None = None
    description: str | None = None


class JobOut(JobBase, Audit):
    id: str


JobCreate = JobBase
JobUpdate = make_partial("JobUpdate", JobBase)


# --------------------------------------------------------------------------- #
# Tài chính — khoá logic là `year`, MongoDB _id vẫn là ObjectId
# --------------------------------------------------------------------------- #

class FinancialBase(BaseModel):
    year: int = Field(ge=1900, le=2200)
    revenue: int = Field(default=0, ge=0)
    profit_after_tax: int = 0
    total_assets: int = Field(default=0, ge=0)
    equity: int = 0
    is_published: bool = True


class FinancialOut(FinancialBase, Audit):
    id: str


FinancialCreate = FinancialBase
FinancialUpdate = make_partial("FinancialUpdate", FinancialBase)


# --------------------------------------------------------------------------- #
# Đối tác
# --------------------------------------------------------------------------- #

class PartnerBase(PublishMixin):
    name: str = Field(min_length=1, max_length=300)
    country: str | None = Field(default=None, max_length=80)
    role: str | None = Field(default=None, description="customer | manufacturer")


class PartnerOut(PartnerBase, Audit):
    id: str


PartnerCreate = PartnerBase
PartnerUpdate = make_partial("PartnerUpdate", PartnerBase)


# --------------------------------------------------------------------------- #
# Hộp thư liên hệ (chỉ đọc + đánh dấu đã đọc)
# --------------------------------------------------------------------------- #

class ContactMessageOut(Audit):
    id: str
    full_name: str
    email: EmailStr
    phone: str | None = None
    subject: str | None = None
    message: str
    is_read: bool


class ContactMessagePatch(BaseModel):
    is_read: bool


# --------------------------------------------------------------------------- #
# Sắp xếp lại thứ tự hiển thị
# --------------------------------------------------------------------------- #

class ReorderIn(BaseModel):
    ids: list[str] = Field(min_length=1, description="Danh sách ObjectId theo thứ tự mong muốn")

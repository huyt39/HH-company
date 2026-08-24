from datetime import date

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import Media, Timestamped


class Category(BaseModel):
    id: str
    slug: str
    name: str


class NewsItem(Timestamped):
    id: str
    slug: str
    title: str
    excerpt: str | None = None
    content: str | None = None
    cover: Media | None = None
    category: Category | None = None
    published_at: date | None = None


class Project(Timestamped):
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


class BusinessField(BaseModel):
    id: str
    slug: str
    name: str
    description: str | None = None
    icon: str | None = None
    cover: Media | None = None


class Product(BaseModel):
    id: str
    slug: str
    name: str
    description: str | None = None
    specs: list[str] = Field(default_factory=list)
    applications: list[str] = Field(default_factory=list)
    icon: str | None = None


class JobPosting(Timestamped):
    id: str
    slug: str
    title: str
    department: str | None = None
    location: str | None = None
    employment_type: str | None = None
    quantity: int = 1
    deadline: date | None = None
    description: str | None = None


class CompanyMilestone(BaseModel):
    year: int
    title: str
    description: str | None = None


class Leader(BaseModel):
    name: str
    title: str


class OrgUnit(BaseModel):
    name: str
    name_en: str | None = None
    children: list[str] = Field(default_factory=list)


class CompanyProfile(BaseModel):
    name: str
    name_en: str | None = None
    short_name: str | None = None
    tagline: str | None = None
    tax_code: str | None = None
    established: str | None = None
    charter_capital: str | None = None
    status: str | None = Field(default=None, description="Tình trạng hoạt động")
    employees: str | None = Field(default=None, description="Quy mô nhân sự")
    main_business_line: str | None = Field(default=None, description="Ngành nghề kinh doanh chính")
    business_lines_count: int | None = Field(default=None, description="Số ngành nghề đã đăng ký")
    intro: list[str] = Field(default_factory=list)
    vision: str | None = None
    mission: str | None = None
    core_values: list[str] = Field(default_factory=list)
    leaders: list[Leader] = Field(default_factory=list)
    org_units: list[OrgUnit] = Field(default_factory=list)
    milestones: list[CompanyMilestone] = Field(default_factory=list)


class FinancialYear(BaseModel):
    year: int
    revenue: int = Field(description="Doanh thu thuần (VNĐ)")
    profit_after_tax: int = Field(description="Lợi nhuận sau thuế (VNĐ)")
    total_assets: int = Field(description="Tổng tài sản (VNĐ)")
    equity: int = Field(description="Vốn chủ sở hữu (VNĐ)")


class Partner(BaseModel):
    name: str
    country: str | None = None
    role: str | None = Field(default=None, description="customer | manufacturer")


class ContactInfo(BaseModel):
    address: str | None = None
    phone: str | None = None
    fax: str | None = None
    email: str | None = None
    tax_code: str | None = None
    map_embed_url: str | None = None


class ContactMessageIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    subject: str | None = Field(default=None, max_length=200)
    message: str = Field(min_length=10, max_length=4000)


class ContactMessageOut(BaseModel):
    success: bool = True
    message: str = "Đã tiếp nhận thông tin liên hệ."

"""Company profile and contact info — singleton data."""

from pydantic import BaseModel, Field


class Leader(BaseModel):
    name: str
    title: str


class OrgUnit(BaseModel):
    name: str
    name_en: str | None = None
    children: list[str] = Field(default_factory=list)


class PersonnelGroup(BaseModel):
    """One site role listed on the capability page.

    Deliberately has no headcount: none of the source documents (capability
    profile, business registration, brand report) states one, so the page lists
    which roles the company fields rather than inventing numbers.
    """

    title: str
    note: str | None = None


class CapabilityStat(BaseModel):
    """A headline figure on the home hero and the capability page."""

    value: str
    label: str
    label_en: str | None = None


class CompanyMilestone(BaseModel):
    year: int
    title: str
    description: str | None = None


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
    personnel: list[PersonnelGroup] = Field(default_factory=list)
    capability_stats: list[CapabilityStat] = Field(default_factory=list)


class ContactInfo(BaseModel):
    address: str | None = None
    phone: str | None = None
    fax: str | None = None
    email: str | None = None
    tax_code: str | None = None
    map_embed_url: str | None = None

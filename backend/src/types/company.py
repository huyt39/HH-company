"""Company profile and contact info — singleton data."""

from pydantic import BaseModel, Field


class Leader(BaseModel):
    name: str
    title: str


class Advisor(BaseModel):
    """A member of the founding advisory board (Ban Cố vấn kiêm sáng lập).

    Kept apart from `leaders`: advisors are not company officers, and a bidder
    reading the profile needs to see which is which.
    """

    name: str
    title: str
    highlights: list[str] = Field(default_factory=list)


class OrgUnit(BaseModel):
    """One box on the org chart.

    `spine` marks a unit that the whole company reports through — the members'
    council and the CEO — drawn stacked one above the other. Everything else is
    a branch drawn side by side on the row below the spine.
    """

    name: str
    name_en: str | None = None
    spine: bool = False
    children: list[str] = Field(default_factory=list)


class PersonnelGroup(BaseModel):
    """One site role listed on the capability page.

    `count` is filled in only where a source document states it — the 2026–2027
    capability profile gives a headcount per engineering discipline, the older
    documents give none. Roles without a stated number keep `count` empty and
    the page lists the role on its own.
    """

    title: str
    count: int | None = None
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
    advisors: list[Advisor] = Field(default_factory=list)
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

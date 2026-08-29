"""Job postings — public and admin types."""

from datetime import date

from pydantic import Field

from src.types.common import AuditedResponse, PublishFields, Timestamped, make_optional


class JobResponse(Timestamped):
    id: str
    slug: str
    title: str
    department: str | None = None
    location: str | None = None
    employment_type: str | None = None
    quantity: int = 1
    deadline: date | None = None
    description: str | None = None


class JobBase(PublishFields):
    slug: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=300)
    department: str | None = None
    location: str | None = None
    employment_type: str | None = None
    quantity: int = Field(default=1, ge=1)
    deadline: date | None = None
    description: str | None = None


class JobAdminResponse(JobBase, AuditedResponse):
    pass


JobCreate = JobBase
JobUpdate = make_optional("JobUpdate", JobBase)

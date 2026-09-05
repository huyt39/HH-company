from typing import Any

from beanie import Indexed
from pydantic import Field

from src.models.base import PublishableDocument


class BusinessField(PublishableDocument):
    """One construction service the company performs on site.

    Was a plain "line of business" list. `category` splits the catalogue the way
    a specialist contractor's clients think about it — new build, repair and
    strengthening, technology transfer — and the list fields carry what a main
    contractor or supervision consultant actually asks for before awarding a
    subcontract: how the work is sequenced, against which standards, and what
    paperwork comes back at handover.
    """

    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    name: str
    summary: str | None = None
    description: str | None = None
    category: str | None = None  # build | repair | technology
    process_steps: list[str] = Field(default_factory=list)
    standards: list[str] = Field(default_factory=list)
    deliverables: list[str] = Field(default_factory=list)
    # Matches `Project.work_types`, so a service page can list its own projects.
    work_type: str | None = None
    icon: str | None = None
    cover: dict[str, Any] | None = None

    class Settings:
        name = "business_fields"

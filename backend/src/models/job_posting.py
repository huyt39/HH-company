from datetime import date

from beanie import Indexed

from src.models.base import PublishableDocument


class JobPosting(PublishableDocument):
    """A job opening."""

    slug: Indexed(str, unique=True)  # type: ignore[valid-type]
    title: str
    department: str | None = None
    location: str | None = None
    employment_type: str | None = None
    quantity: int = 1
    deadline: date | None = None
    description: str | None = None

    class Settings:
        name = "jobs"

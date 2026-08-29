"""Contact form and admin inbox."""

from pydantic import BaseModel, EmailStr, Field

from src.types.common import AuditedResponse


class ContactMessageRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    subject: str | None = Field(default=None, max_length=200)
    message: str = Field(min_length=10, max_length=4000)


class ContactMessageResponse(AuditedResponse):
    full_name: str
    email: EmailStr
    phone: str | None = None
    subject: str | None = None
    message: str
    is_read: bool


class ContactMessagePatch(BaseModel):
    is_read: bool


class UnreadCountResponse(BaseModel):
    count: int

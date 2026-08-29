"""Customers and manufacturers."""

from pydantic import BaseModel, Field

from src.types.common import AuditedResponse, PublishFields, make_optional


class PartnerResponse(BaseModel):
    name: str
    country: str | None = None
    role: str | None = Field(default=None, description="customer | manufacturer")


class PartnerBase(PublishFields):
    name: str = Field(min_length=1, max_length=300)
    country: str | None = Field(default=None, max_length=80)
    role: str | None = Field(default=None, description="customer | manufacturer")


class PartnerAdminResponse(PartnerBase, AuditedResponse):
    pass


PartnerCreate = PartnerBase
PartnerUpdate = make_optional("PartnerUpdate", PartnerBase)

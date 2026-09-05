"""Company profile, contact info and partners — public.

Financial figures are intentionally absent: they are kept in the admin for the
capability profile submitted with a bid, not published on the website.
"""

from fastapi import APIRouter, Query

from src.services import CompanyService, ContentService
from src.types import (
    BaseApiResponse,
    CompanyProfile,
    ContactInfo,
    PartnerResponse,
)

router = APIRouter(prefix="/company", tags=["Công ty"])


@router.get("/profile", response_model=BaseApiResponse[CompanyProfile])
async def get_profile():
    """Company profile: intro, vision, leadership, org chart."""
    return BaseApiResponse(detail="Hồ sơ công ty", data=await CompanyService().get_profile())


@router.get("/contact-info", response_model=BaseApiResponse[ContactInfo])
async def get_contact_info():
    """Address, phone and contact email."""
    return BaseApiResponse(detail="Thông tin liên hệ", data=await CompanyService().get_contact_info())


@router.get("/partners", response_model=BaseApiResponse[list[PartnerResponse]])
async def list_partners(
    role: str | None = Query(None, description="customer | manufacturer"),
):
    """List customers and manufacturers."""
    return BaseApiResponse(detail="Khách hàng và nhà sản xuất", data=await ContentService().list_partners(role))

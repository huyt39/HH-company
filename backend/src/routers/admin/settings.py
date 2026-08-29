"""Company profile and contact info — admin."""

from fastapi import APIRouter

from src.dependencies import require_admin
from src.services import CompanyService
from src.types import BaseApiResponse, CompanyProfile, ContactInfo

router = APIRouter(prefix="/settings", tags=["Quản trị · Cài đặt"], dependencies=[require_admin])


@router.get("/profile", response_model=BaseApiResponse[CompanyProfile])
async def read_profile():
    """Read the company profile."""
    return BaseApiResponse(detail="Hồ sơ công ty", data=await CompanyService().get_profile())


@router.put("/profile", response_model=BaseApiResponse[CompanyProfile])
async def save_profile(payload: CompanyProfile):
    """Save the company profile."""
    return BaseApiResponse(
        detail="Đã lưu hồ sơ công ty", data=await CompanyService().save_profile(payload)
    )


@router.get("/contact-info", response_model=BaseApiResponse[ContactInfo])
async def read_contact_info():
    """Read the contact info."""
    return BaseApiResponse(detail="Thông tin liên hệ", data=await CompanyService().get_contact_info())


@router.put("/contact-info", response_model=BaseApiResponse[ContactInfo])
async def save_contact_info(payload: ContactInfo):
    """Save the contact info."""
    return BaseApiResponse(
        detail="Đã lưu thông tin liên hệ", data=await CompanyService().save_contact_info(payload)
    )

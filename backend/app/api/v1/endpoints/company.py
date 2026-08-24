from fastapi import APIRouter, Query

from app.schemas.content import CompanyProfile, ContactInfo, FinancialYear, Partner
from app.services import store

router = APIRouter()


@router.get("/profile", response_model=CompanyProfile, summary="Hồ sơ công ty")
async def get_profile():
    return await store.get_company_profile()


@router.get("/contact-info", response_model=ContactInfo, summary="Thông tin liên hệ")
async def get_contact_info():
    return await store.get_contact_info()


@router.get("/financials", response_model=list[FinancialYear], summary="Số liệu tài chính")
async def list_financials():
    return await store.list_financials()


@router.get("/partners", response_model=list[Partner], summary="Khách hàng và nhà sản xuất")
async def list_partners(
    role: str | None = Query(None, description="customer | manufacturer"),
):
    return await store.list_partners(role)

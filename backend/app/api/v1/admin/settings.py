"""Hồ sơ công ty và thông tin liên hệ — dữ liệu singleton lưu trong collection settings."""

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.db.seed import COMPANY_PROFILE_KEY, CONTACT_INFO_KEY
from app.models import Setting
from app.schemas.content import CompanyProfile, ContactInfo

router = APIRouter(dependencies=[Depends(get_current_user)])


async def _upsert(key: str, value: dict) -> dict:
    row = await Setting.find_one(Setting.key == key)
    if row is None:
        await Setting(key=key, value=value).insert()
    else:
        row.value = value
        await row.save()
    return value


@router.get("/profile", response_model=CompanyProfile, summary="Đọc hồ sơ công ty")
async def read_profile():
    row = await Setting.find_one(Setting.key == COMPANY_PROFILE_KEY)
    return CompanyProfile.model_validate(row.value) if row else CompanyProfile(name="")


@router.put("/profile", response_model=CompanyProfile, summary="Lưu hồ sơ công ty")
async def save_profile(payload: CompanyProfile):
    await _upsert(COMPANY_PROFILE_KEY, payload.model_dump(mode="json"))
    return payload


@router.get("/contact-info", response_model=ContactInfo, summary="Đọc thông tin liên hệ")
async def read_contact_info():
    row = await Setting.find_one(Setting.key == CONTACT_INFO_KEY)
    return ContactInfo.model_validate(row.value) if row else ContactInfo()


@router.put("/contact-info", response_model=ContactInfo, summary="Lưu thông tin liên hệ")
async def save_contact_info(payload: ContactInfo):
    await _upsert(CONTACT_INFO_KEY, payload.model_dump(mode="json"))
    return payload

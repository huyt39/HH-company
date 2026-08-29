"""Company profile and contact info — singletons in the `settings` collection."""

from src.configs import SETTING_KEY
from src.repositories import SettingRepository
from src.types import CompanyProfile, ContactInfo


class CompanyService:
    def __init__(self, settings: SettingRepository | None = None) -> None:
        self.settings = settings or SettingRepository()

    async def get_profile(self) -> CompanyProfile:
        value = await self.settings.get_value(SETTING_KEY.COMPANY_PROFILE)
        return CompanyProfile.model_validate(value) if value else CompanyProfile(name="")

    async def save_profile(self, profile: CompanyProfile) -> CompanyProfile:
        await self.settings.set_value(
            SETTING_KEY.COMPANY_PROFILE, profile.model_dump(mode="json")
        )
        return profile

    async def get_contact_info(self) -> ContactInfo:
        value = await self.settings.get_value(SETTING_KEY.CONTACT_INFO)
        return ContactInfo.model_validate(value) if value else ContactInfo()

    async def save_contact_info(self, info: ContactInfo) -> ContactInfo:
        await self.settings.set_value(SETTING_KEY.CONTACT_INFO, info.model_dump(mode="json"))
        return info

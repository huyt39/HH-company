"""Seeds an empty database on startup.

Guarded by a flag document in `settings`: once seeded, later boots cost a
single query and return — this matters on serverless, where every cold start
runs it again.

To recreate the admin account after seeding:
    python -m scripts.manage_users create-user <email>
"""

from src.configs import SETTING_KEY, security_config
from src.repositories import (
    BusinessFieldRepository,
    CertificateRepository,
    DocumentRepository,
    EquipmentRepository,
    FinancialYearRepository,
    PartnerRepository,
    ProductRepository,
    ProjectRepository,
    SettingRepository,
    UserRepository,
)
from src.services import seed_data
from src.services.password_service import generate_password, hash_password
from src.utils import Logger

logger = Logger("seed_service")


class SeedService:
    def __init__(self) -> None:
        self.settings = SettingRepository()
        self.users = UserRepository()
        self.fields = BusinessFieldRepository()
        self.products = ProductRepository()
        self.projects = ProjectRepository()
        self.financials = FinancialYearRepository()
        self.partners = PartnerRepository()
        self.certificates = CertificateRepository()
        self.equipment = EquipmentRepository()
        self.documents = DocumentRepository()

    async def run(self) -> None:
        """Seed the database unless it has been seeded before."""
        if await self.settings.has_key(SETTING_KEY.SEEDED):
            return

        logger.info("Empty database — seeding initial data.")
        await self._seed_admin()
        await self._seed_singletons()
        await self._seed_collections()
        await self.settings.set_value(SETTING_KEY.SEEDED, {"done": True})
        logger.info("Seeding complete.")

    # ---- Admin account ----------------------------------------------------- #

    async def _seed_admin(self) -> None:
        if await self.users.has_any():
            return

        password = security_config.ADMIN_PASSWORD or generate_password()
        await self.users.create(
            {
                "email": security_config.ADMIN_EMAIL,
                "full_name": "Quản trị viên",
                "password_hash": hash_password(password),
            }
        )

        if security_config.ADMIN_PASSWORD:
            logger.warning(
                f"Created admin account {security_config.ADMIN_EMAIL} "
                "(password taken from ADMIN_PASSWORD)"
            )
        else:
            border = "=" * 72
            logger.warning(
                f"\n{border}\n"
                "  ADMIN ACCOUNT CREATED — SAVE THIS NOW, SHOWN ONLY ONCE\n"
                f"  Email:    {security_config.ADMIN_EMAIL}\n"
                f"  Password: {password}\n"
                f"{border}"
            )

    # ---- Singleton documents ----------------------------------------------- #

    async def _seed_singletons(self) -> None:
        if not await self.settings.has_key(SETTING_KEY.COMPANY_PROFILE):
            await self.settings.set_value(
                SETTING_KEY.COMPANY_PROFILE, seed_data.COMPANY_PROFILE.model_dump(mode="json")
            )
        if not await self.settings.has_key(SETTING_KEY.CONTACT_INFO):
            await self.settings.set_value(
                SETTING_KEY.CONTACT_INFO, seed_data.CONTACT_INFO.model_dump(mode="json")
            )

    # ---- Content collections ----------------------------------------------- #

    async def _seed_collections(self) -> None:
        await self._insert_ordered(self.fields, seed_data.BUSINESS_FIELDS)
        await self._insert_ordered(self.products, seed_data.PRODUCTS)
        await self._insert_ordered(self.projects, seed_data.PROJECTS)
        await self._insert_ordered(self.partners, seed_data.PARTNERS)
        await self._insert_ordered(self.certificates, seed_data.CERTIFICATES)
        await self._insert_ordered(self.equipment, seed_data.EQUIPMENT)
        await self._insert_ordered(self.documents, seed_data.DOCUMENTS)

        if not await self.financials.find_one():
            for item in seed_data.FINANCIALS:
                await self.financials.create(item.model_dump())

    @staticmethod
    async def _insert_ordered(repository, items: list) -> None:
        """Insert in seed-file order, numbering `sort_order` as we go."""
        if await repository.find_one():
            return
        docs = [
            repository.model(**{**item.model_dump(), "sort_order": index})
            for index, item in enumerate(items)
        ]
        if docs:
            await repository.model.insert_many(docs)

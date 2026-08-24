"""Khởi tạo collection và nạp dữ liệu ban đầu vào MongoDB.

Chạy an toàn nhiều lần: chỉ chèn khi collection còn rỗng, không ghi đè nội dung
admin đã sửa. Gọi tự động lúc ứng dụng khởi động (xem `app/main.py`).
"""

import logging

from app.core.config import settings
from app.core.security import generate_password, hash_password
from app.models import (
    BusinessField,
    FinancialYear,
    Partner,
    Product,
    Project,
    Setting,
    User,
)
from app.services import seed_data

logger = logging.getLogger("uvicorn.error")

COMPANY_PROFILE_KEY = "company_profile"
CONTACT_INFO_KEY = "contact_info"
SEEDED_KEY = "_seeded"


async def _seed_admin() -> None:
    if await User.find_one():
        return

    password = settings.ADMIN_PASSWORD or generate_password()
    user = User(
        email=settings.ADMIN_EMAIL,
        full_name="Quản trị viên",
        password_hash=hash_password(password),
    )
    await user.insert()

    if settings.ADMIN_PASSWORD:
        logger.warning("Đã tạo tài khoản admin: %s (mật khẩu lấy từ ADMIN_PASSWORD)", settings.ADMIN_EMAIL)
    else:
        logger.warning(
            "\n%s\n  TÀI KHOẢN ADMIN VỪA ĐƯỢC TẠO — LƯU LẠI NGAY, MẬT KHẨU CHỈ HIỆN MỘT LẦN\n"
            "  Email:    %s\n  Mật khẩu: %s\n%s",
            "=" * 72,
            settings.ADMIN_EMAIL,
            password,
            "=" * 72,
        )


async def _seed_settings() -> None:
    if not await Setting.find_one(Setting.key == COMPANY_PROFILE_KEY):
        await Setting(
            key=COMPANY_PROFILE_KEY,
            value=seed_data.COMPANY_PROFILE.model_dump(),
        ).insert()

    if not await Setting.find_one(Setting.key == CONTACT_INFO_KEY):
        await Setting(
            key=CONTACT_INFO_KEY,
            value=seed_data.CONTACT_INFO.model_dump(),
        ).insert()


async def _seed_collections() -> None:
    if not await BusinessField.find_one():
        await BusinessField.insert_many(
            [
                BusinessField(
                    slug=f.slug,
                    name=f.name,
                    description=f.description,
                    icon=f.icon,
                    sort_order=i,
                )
                for i, f in enumerate(seed_data.BUSINESS_FIELDS)
            ]
        )

    if not await Product.find_one():
        await Product.insert_many(
            [
                Product(
                    slug=p.slug,
                    name=p.name,
                    description=p.description,
                    specs=p.specs,
                    applications=p.applications,
                    icon=p.icon,
                    sort_order=i,
                )
                for i, p in enumerate(seed_data.PRODUCTS)
            ]
        )

    if not await Project.find_one():
        await Project.insert_many(
            [
                Project(
                    slug=p.slug,
                    name=p.name,
                    summary=p.summary,
                    location=p.location,
                    scale=p.scale,
                    investor=p.investor,
                    year=p.year,
                    status=p.status,
                    context=p.context,
                    context_source=p.context_source,
                    gallery=[],
                    sort_order=i,
                )
                for i, p in enumerate(seed_data.PROJECTS)
            ]
        )

    if not await FinancialYear.find_one():
        await FinancialYear.insert_many(
            [
                FinancialYear(
                    year=f.year,
                    revenue=f.revenue,
                    profit_after_tax=f.profit_after_tax,
                    total_assets=f.total_assets,
                    equity=f.equity,
                )
                for f in seed_data.FINANCIALS
            ]
        )

    if not await Partner.find_one():
        await Partner.insert_many(
            [
                Partner(name=p.name, country=p.country, role=p.role, sort_order=i)
                for i, p in enumerate(seed_data.PARTNERS)
            ]
        )


async def init_db() -> None:
    """Gọi từ main.py sau khi Beanie đã được khởi tạo."""
    await _seed_admin()
    await _seed_settings()

    # Chỉ nạp dữ liệu mẫu đúng một lần trong đời database.
    if not await Setting.find_one(Setting.key == SEEDED_KEY):
        await _seed_collections()
        await Setting(key=SEEDED_KEY, value={"done": True}).insert()

"""Apply the contractor repositioning to an already-seeded database.

    python -m scripts.apply_contractor_repositioning --dry-run
    python -m scripts.apply_contractor_repositioning

`SeedService` runs once and then never again, so editing `seed_data.py` does
not reach a database that has already been seeded. This script carries the
repositioning across, one concern at a time, and prints what it will do first.

What it touches:

  profile     vision, mission, intro, core_values, capability_stats,
              personnel and any milestone year not already present. Leaders and
              org units are left alone — those are maintained through /admin.
  services    replaces the old "lĩnh vực hoạt động" records with the service
              catalogue, but only if the services collection still holds the
              original eleven slugs and nothing has been added by hand.
  projects    fills in `role`, `work_types` and `structure_type` per slug, and
              updates `scale`/`summary` only where the stored text still
              matches the old seed wording character for character.
  capability  inserts certificates and equipment if those collections are empty.

Anything edited through /admin is detected and skipped, with a line saying so.
"""

import asyncio
import sys
from urllib.parse import urlsplit

from src.configs import SETTING_KEY, mongo_config
from src.repositories import (
    BusinessFieldRepository,
    CertificateRepository,
    EquipmentRepository,
    ProjectRepository,
    SettingRepository,
)
from src.services import MongoDatabase
from src.services import seed_data

# Profile fields safe to overwrite: single values written by the seed and not
# edited through /admin in normal use.
#
# `tagline` is deliberately NOT in this list. It holds the company's own slogan
# ("Công nghệ vươn tầm, hợp tác thành công"), which is a brand asset — the
# repositioning changes how the site describes the work, not what the company
# calls itself.
_SCALAR_PROFILE_FIELDS = ("vision", "mission")

# The intro paragraphs the original seed wrote. They lead the About page and
# still carry the supplier voice, so they need replacing — but only when they
# are word-for-word the old seed, never when someone has rewritten them.
_ORIGINAL_INTRO = [
    "Công ty TNHH Đầu tư xây dựng và dịch vụ thương mại Hòa Hoàng (Hoa Hoang Intra "
    "Co., Ltd) là đơn vị chuyên cung cấp và thi công lắp đặt hệ cáp neo dự ứng lực "
    "ngoài, neo dự ứng lực trong, hệ cáp cho cầu dây võng, dây văng và cầu vòm, gối "
    "cầu các loại, khe co giãn các loại cùng những thiết bị liên quan cho các dự án "
    "hạ tầng giao thông tại Việt Nam từ năm 2014 (trước đây công ty mang tên TCC).",
    "Chúng tôi phân phối sản phẩm của các thương hiệu hàng đầu Trung Quốc, cáp hãng "
    "SHINKO Nhật Bản, cáp và gối hãng Hirun của Italy. Các sản phẩm này đã được sử "
    "dụng cho nhiều dự án cầu đường bộ và tuyến cao tốc trọng điểm: cao tốc Sài Gòn "
    "– Long Thành – Dầu Giây, Bến Lức – Long Thành, Hà Nội – Lào Cai, cầu Móng Sến "
    "– Sa Pa, cầu Tân Đệ, cầu Nguyễn Hữu Cảnh, cầu Trà Khúc 2, cầu Xóm Củi, cầu "
    "Nhơn Trạch, cầu Đại Ngãi 2 và nhiều công trình khác.",
    "Hòa Hoàng đang hợp tác với các Viện thiết kế đường sắt Trung Quốc và các nhà "
    "máy cung cấp thiết bị thi công đường sắt cao tốc, phối hợp cùng chuyên gia để "
    "cung cấp thiết bị và tư vấn chuyển giao công nghệ thi công kết cấu hạ tầng "
    "đường sắt tốc độ cao cũng như tàu điện ngầm.",
]

# The eleven slugs the original seed created. If the services collection holds
# exactly these, nobody has curated it and it is safe to replace.
_ORIGINAL_FIELD_SLUGS = {
    "duong-sat-toc-do-cao",
    "he-cap-cau",
    "cap-dul-ngoai",
    "goi-cau-duong-bo",
    "goi-cau-duong-sat",
    "goi-cao-su-ben-cang",
    "khe-co-gian",
    "neo-cang-keo",
    "may-moc-thiet-bi",
    "sua-chua-cau-cu",
    "dich-vu-ky-thuat",
}


def target_description() -> str:
    host = urlsplit(mongo_config.MONGODB_URL).hostname or "?"
    return f"{host} / {mongo_config.MONGODB_DB_NAME}"


async def apply_profile(dry_run: bool) -> int:
    settings = SettingRepository()
    stored = await settings.get_value(SETTING_KEY.COMPANY_PROFILE)
    if stored is None:
        print("  hồ sơ công ty: chưa seed, bỏ qua")
        return 0

    seed = seed_data.COMPANY_PROFILE.model_dump()
    changed = 0

    for name in _SCALAR_PROFILE_FIELDS:
        if stored.get(name) != seed[name]:
            print(f"  {name}: đổi sang {seed[name][:60]}…")
            stored[name] = seed[name]
            changed += 1

    # Lists are replaced only when still empty or still equal to the old seed,
    # so a hand-curated list is never discarded.
    if not stored.get("capability_stats"):
        print(f"  capability_stats: thêm {len(seed['capability_stats'])} số liệu")
        stored["capability_stats"] = seed["capability_stats"]
        changed += 1
    if not stored.get("personnel"):
        print(f"  personnel: thêm {len(seed['personnel'])} vị trí (chưa có số lượng)")
        stored["personnel"] = seed["personnel"]
        changed += 1

    if stored.get("intro") == _ORIGINAL_INTRO:
        print(f"  intro: thay {len(_ORIGINAL_INTRO)} đoạn cũ bằng {len(seed['intro'])} đoạn mới")
        stored["intro"] = seed["intro"]
        changed += 1
    elif stored.get("intro") != seed["intro"]:
        print("  intro: đã sửa trong /admin, giữ nguyên")

    old_values = [
        "Chất lượng sản phẩm đạt tiêu chuẩn ASTM, ISO và tiêu chuẩn dự án",
        "Đáp ứng đúng tiến độ giao hàng và thi công",
        "Dịch vụ kỹ thuật và hỗ trợ hiện trường xuyên suốt",
        "Minh bạch trong hồ sơ pháp lý, xuất xứ và thí nghiệm vật liệu",
    ]
    if stored.get("core_values") == old_values:
        print("  core_values: thay bằng bộ giá trị của nhà thầu")
        stored["core_values"] = seed["core_values"]
        changed += 1
    elif stored.get("core_values") != seed["core_values"]:
        print("  core_values: đã sửa trong /admin, giữ nguyên")

    stored_years = {m["year"] for m in stored.get("milestones", [])}
    new_milestones = [m for m in seed["milestones"] if m["year"] not in stored_years]
    if new_milestones:
        for milestone in new_milestones:
            print(f"  milestones: thêm mốc {milestone['year']} — {milestone['title']}")
        merged = stored.get("milestones", []) + new_milestones
        stored["milestones"] = sorted(merged, key=lambda m: m["year"])
        changed += 1

    if changed and not dry_run:
        await settings.set_value(SETTING_KEY.COMPANY_PROFILE, stored)
    return changed


async def apply_services(dry_run: bool) -> int:
    services = BusinessFieldRepository()
    rows = await services.find_many({})
    stored_slugs = {row.slug for row in rows}

    new_slugs = {item.slug for item in seed_data.BUSINESS_FIELDS}

    if stored_slugs == new_slugs:
        print("  dịch vụ: đã là danh mục dịch vụ mới, bỏ qua")
        return 0
    if not rows:
        print(f"  dịch vụ: collection rỗng, thêm {len(seed_data.BUSINESS_FIELDS)} bản ghi")
    elif stored_slugs == _ORIGINAL_FIELD_SLUGS:
        print(f"  dịch vụ: thay {len(rows)} lĩnh vực cũ bằng {len(seed_data.BUSINESS_FIELDS)} dịch vụ")
    else:
        added = stored_slugs - _ORIGINAL_FIELD_SLUGS
        print(f"  dịch vụ: đã chỉnh sửa trong /admin ({len(added)} slug lạ), GIỮ NGUYÊN")
        print("           muốn thay thì xoá thủ công trong /admin rồi chạy lại")
        return 0

    if dry_run:
        return len(seed_data.BUSINESS_FIELDS)

    for row in rows:
        await row.delete()
    docs = [
        services.model(**{**item.model_dump(), "sort_order": index})
        for index, item in enumerate(seed_data.BUSINESS_FIELDS)
    ]
    await services.model.insert_many(docs)
    return len(docs)


async def apply_projects(dry_run: bool) -> int:
    projects = ProjectRepository()
    seeded = {item.slug: item for item in seed_data.PROJECTS}
    changed = 0

    for row in await projects.find_many({}):
        item = seeded.get(row.slug)
        if item is None:
            continue

        updates: dict = {}
        if not row.work_types:
            updates.update(
                role=item.role, work_types=item.work_types, structure_type=item.structure_type
            )
        # Only rewrite the wording where the stored text is still the untouched
        # seed text under the other voice; a hand-edited scope is left alone.
        if row.scale != item.scale and row.scale == row.summary:
            updates.update(scale=item.scale, summary=item.summary)

        if not updates:
            continue
        changed += 1
        print(f"  {row.slug}: {', '.join(updates)}")
        if not dry_run:
            for key, value in updates.items():
                setattr(row, key, value)
            await row.save()

    return changed


async def apply_capability(dry_run: bool) -> int:
    changed = 0
    for repository, items, label in (
        (CertificateRepository(), seed_data.CERTIFICATES, "chứng chỉ"),
        (EquipmentRepository(), seed_data.EQUIPMENT, "thiết bị"),
    ):
        if await repository.find_one():
            print(f"  {label}: đã có dữ liệu, bỏ qua")
            continue
        print(f"  {label}: thêm {len(items)} bản ghi")
        changed += len(items)
        if not dry_run:
            docs = [
                repository.model(**{**item.model_dump(), "sort_order": index})
                for index, item in enumerate(items)
            ]
            if docs:
                await repository.model.insert_many(docs)
    return changed


async def main_async(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv

    print(f"Đích: {target_description()}")
    if dry_run:
        print("CHẾ ĐỘ THỬ — không ghi gì lên database")
    print()

    database = MongoDatabase()
    await database.connect()
    try:
        total = 0
        for title, step in (
            ("Hồ sơ công ty", apply_profile),
            ("Dịch vụ thi công", apply_services),
            ("Dự án", apply_projects),
            ("Năng lực nhà thầu", apply_capability),
        ):
            print(f"{title}:")
            total += await step(dry_run)
            print()
    finally:
        await database.close()

    print(f"  tổng cộng {total} thay đổi")
    if dry_run and total:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

"""Carry the 2026–2027 capability profile across to an already-seeded database.

    python -m scripts.apply_hsnl_2026 --dry-run
    python -m scripts.apply_hsnl_2026

`SeedService` runs once and then never again, so editing `seed_data.py` does not
reach a database that has already been seeded. The company handed over a new
capability profile ("HỒ SƠ NĂNG LỰC HÒA HOÀNG", 2026–2027) which supersedes the
R5 profile on several points; this script moves those points across, one concern
at a time, and prints what it will do first.

What it touches:

  profile     leaders (5 deputy GMs added), advisors (new field), org_units
              (deputy-GM structure replaces the old departmental chart, with
              HĐTV and TGĐ flagged as the reporting spine),
              personnel (headcount per discipline), capability_stats, employees
              and the new intro paragraph about the Hạng I licence.
  projects    adds cầu Phước Khánh (gia cường xà mũ) and cầu Lô Đông; upgrades
              cầu Giới Phiên from "supply" to "construction" and rewrites its
              scope to the contract wording; attaches the new photographs.
  services    attaches a cover photograph to the three services that now have
              one, and refreshes the expansion-joint replacement description.
  capability  adds the Bộ Xây dựng Hạng I licence and the two new plant items.

A record that no longer matches the old seed text is treated as hand-edited in
/admin and left alone, with a line saying so.
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
from src.services import MongoDatabase, seed_data

# Profile lists replaced wholesale: every one of these is a straight restatement
# of a source document, not something curated through /admin.
_PROFILE_LISTS = ("leaders", "advisors", "org_units", "personnel", "capability_stats")

# Project slugs the new profile documents for the first time.
_NEW_PROJECT_SLUGS = ("cau-phuoc-khanh-gia-cuong-xa-mu-tru", "cau-lo-dong-hai-phong")

# Giới Phiên was seeded as a supply job from the R5 profile. The new profile
# carries the signed subcontract: 3 steel arch spans plus 160 hanger cables.
# Only rewrite it if the stored scope is still that earlier wording.
_OLD_GIOI_PHIEN_SCALE = (
    "Cung cấp và hướng dẫn thi công hệ neo cáp dùng bó cáp thành phẩm loại PWS 55 sợi f7, "
    "dây thép mạ kẽm cường độ cao xoắn thành bó, ép đùn HDPE 2 lớp, khối lượng 41 tấn."
)

_OLD_JOINT_REPLACEMENT_DESC = (
    "Sửa chữa và thay thế khe co giãn trên cầu đang khai thác, gồm cả khe ray mô "
    "đun khẩu độ lớn. Hòa Hoàng đã thực hiện tại trụ P26 cầu Long Thành trên cao "
    "tốc TP. Hồ Chí Minh – Long Thành – Dầu Giây."
)


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

    for name in _PROFILE_LISTS:
        if stored.get(name) != seed[name]:
            print(f"  {name}: {len(stored.get(name) or [])} → {len(seed[name])} mục")
            stored[name] = seed[name]
            changed += 1

    if stored.get("employees") != seed["employees"]:
        print(f"  employees: {stored.get('employees')} → {seed['employees']}")
        stored["employees"] = seed["employees"]
        changed += 1

    # The licence paragraph is appended rather than replacing the intro: the
    # existing paragraphs may have been rewritten in /admin.
    licence_para = next(p for p in seed["intro"] if "BXD-00011096" in p)
    if not any("BXD-00011096" in p for p in stored.get("intro", [])):
        print("  intro: thêm đoạn về chứng chỉ năng lực Hạng I")
        intro = list(stored.get("intro") or [])
        intro.insert(min(1, len(intro)), licence_para)
        stored["intro"] = intro
        changed += 1

    if changed and not dry_run:
        await settings.set_value(SETTING_KEY.COMPANY_PROFILE, stored)
    return changed


async def apply_projects(dry_run: bool) -> int:
    projects = ProjectRepository()
    seeded = {item.slug: item for item in seed_data.PROJECTS}
    stored_rows = {row.slug: row for row in await projects.find_many({})}
    changed = 0

    for slug in _NEW_PROJECT_SLUGS:
        if slug in stored_rows:
            print(f"  {slug}: đã có, bỏ qua")
            continue
        print(f"  {slug}: thêm dự án mới")
        changed += 1
        if not dry_run:
            await projects.model(**seeded[slug].model_dump()).insert()

    row = stored_rows.get("cau-gioi-phien-yen-bai")
    item = seeded["cau-gioi-phien-yen-bai"]
    if row is not None:
        if row.scale == _OLD_GIOI_PHIEN_SCALE:
            print("  cau-gioi-phien-yen-bai: supply → construction, cập nhật phạm vi hợp đồng")
            changed += 1
            if not dry_run:
                row.name = item.name
                row.investor = item.investor
                row.scale = item.scale
                row.summary = item.summary
                row.role = item.role
                row.work_types = item.work_types
                await row.save()
        else:
            print("  cau-gioi-phien-yen-bai: phạm vi đã sửa trong /admin, giữ nguyên")

    # Photographs: add the ones that are not referenced yet, leave the rest.
    for slug in ("cau-gioi-phien-yen-bai", "cau-phu-thinh-lao-cai"):
        row = stored_rows.get(slug)
        if row is None:
            continue
        seeded_media = seed_data._PROJECT_MEDIA.get(slug, [])
        have = {(m or {}).get("url") for m in (row.gallery or [])}
        missing = [m for m in seeded_media if m["url"] not in have]
        if not missing:
            continue
        print(f"  {slug}: thêm {len(missing)} ảnh")
        changed += 1
        if not dry_run:
            row.gallery = (row.gallery or []) + missing
            await row.save()

    return changed


async def apply_services(dry_run: bool) -> int:
    services = BusinessFieldRepository()
    seeded = {item.slug: item for item in seed_data.BUSINESS_FIELDS}
    changed = 0

    for row in await services.find_many({}):
        item = seeded.get(row.slug)
        if item is None:
            continue

        updates: dict = {}
        if item.cover and not row.cover:
            updates["cover"] = item.cover
        if row.slug == "thay-the-khe-co-gian" and row.description == _OLD_JOINT_REPLACEMENT_DESC:
            updates["description"] = item.description

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
    for repository, items, key, label in (
        (CertificateRepository(), seed_data.CERTIFICATES, "code", "chứng chỉ"),
        (EquipmentRepository(), seed_data.EQUIPMENT, "name", "thiết bị"),
    ):
        rows = await repository.find_many({})
        have = {getattr(row, key) for row in rows}
        missing = [item for item in items if getattr(item, key) not in have]
        if missing:
            for item in missing:
                print(f"  {label}: thêm “{item.name}”")
            changed += len(missing)
            if not dry_run:
                start = len(rows)
                docs = [
                    repository.model(**{**item.model_dump(), "sort_order": start + index})
                    for index, item in enumerate(missing)
                ]
                await repository.model.insert_many(docs)
                rows = await repository.find_many({})
        else:
            print(f"  {label}: đã đủ, bỏ qua")

        # The Hạng I licence and the 10-strong platform fleet are what the new
        # profile leads with, so they lead the list too rather than landing at
        # the bottom in insertion order.
        order = [item.name for item in items]
        for row in rows:
            want = order.index(row.name) if row.name in order else len(order)
            if row.sort_order != want:
                print(f"  {label}: “{row.name[:44]}” về vị trí {want}")
                changed += 1
                if not dry_run:
                    row.sort_order = want
                    await row.save()
    return changed


async def main_async(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    print(f"\nCơ sở dữ liệu: {target_description()}")
    print("Chế độ: thử (không ghi)\n" if dry_run else "Chế độ: ghi thật\n")

    database = MongoDatabase()
    await database.connect()
    try:
        total = 0
        for title, step in (
            ("Hồ sơ công ty", apply_profile),
            ("Dự án", apply_projects),
            ("Dịch vụ thi công", apply_services),
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

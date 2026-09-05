"""Copy one field of the company profile from `seed_data` into a seeded database.

    python -m scripts.apply_profile_field --dry-run tagline
    python -m scripts.apply_profile_field tagline
    python -m scripts.apply_profile_field --allow-list core_values

`SeedService` writes the company profile only once, so editing `seed_data.py`
never reaches a database that has already been seeded. The profile also holds
content the owner maintains through /admin — intro paragraphs, leaders, org
units, milestones — so this script refuses to touch anything but the fields
named on the command line, and prints the old value before replacing it.

Fields that are lists or dicts are rejected: those belong to /admin, and
overwriting them from the seed file would discard real edits. Pass --allow-list
to override that for one run — the old value is printed line by line first, so
whoever runs it sees exactly what is being discarded.
"""

import asyncio
import sys
from urllib.parse import urlsplit

from src.configs import SETTING_KEY, mongo_config
from src.repositories import SettingRepository
from src.services import MongoDatabase
from src.services.seed_data import COMPANY_PROFILE


def target_description() -> str:
    host = urlsplit(mongo_config.MONGODB_URL).hostname or "?"
    return f"{host} / {mongo_config.MONGODB_DB_NAME}"


async def apply_fields(names: list[str], dry_run: bool, allow_list: bool) -> int:
    settings = SettingRepository()
    stored = await settings.get_value(SETTING_KEY.COMPANY_PROFILE)
    if stored is None:
        print("  database chưa có hồ sơ công ty — chạy app một lần để seed trước")
        return 0

    seed = COMPANY_PROFILE.model_dump()
    changed = 0

    for name in names:
        if name not in seed:
            print(f"  {name}: KHÔNG có trong seed_data, bỏ qua")
            continue
        value = seed[name]
        if isinstance(value, (list, dict)) and not allow_list:
            print(f"  {name}: là danh sách/đối tượng — sửa trong /admin, hoặc dùng --allow-list")
            continue
        if stored.get(name) == value:
            print(f"  {name}: không đổi")
            continue

        print(f"  {name}:")
        if isinstance(value, list):
            for line in stored.get(name) or []:
                print(f"      cũ : {line}")
            for line in value:
                print(f"      mới: {line}")
        else:
            print(f"      cũ : {stored.get(name)!r}")
            print(f"      mới: {value!r}")
        stored[name] = value
        changed += 1

    if changed and not dry_run:
        await settings.set_value(SETTING_KEY.COMPANY_PROFILE, stored)

    return changed


async def main_async(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    allow_list = "--allow-list" in argv
    names = [arg for arg in argv if not arg.startswith("-")]
    if not names:
        print(__doc__)
        return 2

    print(f"Đích: {target_description()}")
    if dry_run:
        print("CHẾ ĐỘ THỬ — không ghi gì lên database")
    print()

    database = MongoDatabase()
    await database.connect()
    try:
        changed = await apply_fields(names, dry_run, allow_list)
    finally:
        await database.close()

    print(f"\n  {changed} trường được cập nhật")
    if dry_run and changed:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

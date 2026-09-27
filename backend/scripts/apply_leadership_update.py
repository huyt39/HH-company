"""Apply the September 2026 leadership update to an already-seeded database.

    python -m scripts.apply_leadership_update --dry-run
    python -m scripts.apply_leadership_update

`SeedService` runs once, so changing `seed_data.py` alone does not update a
database that already has a company profile. This script only refreshes the
three leadership-facing lists that changed: leaders, advisors and org_units.
"""

import asyncio
import sys
from urllib.parse import urlsplit

from src.configs import SETTING_KEY, mongo_config
from src.repositories import SettingRepository
from src.services import MongoDatabase, seed_data

_PROFILE_LISTS = ("leaders", "advisors", "org_units")


def target_description() -> str:
    host = urlsplit(mongo_config.MONGODB_URL).hostname or "?"
    return f"{host} / {mongo_config.MONGODB_DB_NAME}"


async def apply_profile(dry_run: bool) -> int:
    settings = SettingRepository()
    stored = await settings.get_value(SETTING_KEY.COMPANY_PROFILE)
    if stored is None:
        print("  hồ sơ công ty: chưa seed, bỏ qua")
        return 0

    seed = seed_data.COMPANY_PROFILE.model_dump(mode="json")
    changed = 0

    for name in _PROFILE_LISTS:
        if stored.get(name) == seed[name]:
            print(f"  {name}: đã đúng")
            continue
        print(f"  {name}: {len(stored.get(name) or [])} → {len(seed[name])} mục")
        stored[name] = seed[name]
        changed += 1

    if changed and not dry_run:
        await settings.set_value(SETTING_KEY.COMPANY_PROFILE, stored)
    return changed


async def main_async(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    print(f"\nCơ sở dữ liệu: {target_description()}")
    print("Chế độ: thử (không ghi)\n" if dry_run else "Chế độ: ghi thật\n")

    database = MongoDatabase()
    await database.connect()
    try:
        print("Hồ sơ công ty:")
        total = await apply_profile(dry_run)
        print()
    finally:
        await database.close()

    print(f"  tổng cộng {total} thay đổi")
    if dry_run and total:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

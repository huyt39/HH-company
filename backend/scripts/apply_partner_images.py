"""Push the partner logos declared in `seed_data` into an already-seeded database.

    python -m scripts.apply_partner_images --dry-run
    python -m scripts.apply_partner_images

Same gap as `apply_project_images`: `SeedService` runs only against an empty
database, so a `logo` added to the seed file never reaches one already seeded.
Partners have no slug, so this matches on `name` instead, and writes `logo`.

Safe to re-run. A partner whose logo was replaced through /admin is left alone
unless the seed carries a different one for that name.
"""

import asyncio
import sys
from urllib.parse import urlsplit

from src.configs import mongo_config
from src.repositories import PartnerRepository
from src.services import MongoDatabase
from src.services.seed_data import PARTNERS


def target_description() -> str:
    host = urlsplit(mongo_config.MONGODB_URL).hostname or "?"
    return f"{host} / {mongo_config.MONGODB_DB_NAME}"


async def apply_logos(dry_run: bool) -> int:
    repository = PartnerRepository()
    updated = 0

    for seed in PARTNERS:
        if seed.logo is None:
            continue

        partner = await repository.find_one({"name": seed.name})
        if partner is None:
            print(f"  bỏ qua — không tìm thấy đối tác: {seed.name}")
            continue

        logo = seed.logo.model_dump()
        if partner.logo == logo:
            print(f"  không đổi: {seed.name}")
            continue

        print(f"  cập nhật {seed.name}")
        updated += 1
        if not dry_run:
            await repository.update(partner, {"logo": logo})

    return updated


async def main_async(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    print(f"Đích: {target_description()}")
    if dry_run:
        print("CHẾ ĐỘ THỬ — không ghi gì lên database")
    print()

    database = MongoDatabase()
    await database.connect()
    try:
        updated = await apply_logos(dry_run)
    finally:
        await database.close()

    print(f"\n  {updated} đối tác được cập nhật logo")
    if dry_run and updated:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

"""Push the project photos declared in `seed_data` into an already-seeded database.

    python -m scripts.apply_project_images --dry-run   # report what would change
    python -m scripts.apply_project_images             # apply

`SeedService` only runs against an empty database, so photos added to the seed
file never reach a database that has already been seeded. This script closes
that gap: it matches on slug and writes `cover` / `gallery`.

Safe to re-run — a project already holding the same media is left alone. Only
projects the seed file carries photos for are touched, so anything set through
the admin elsewhere survives.
"""

import asyncio
import sys

from src.repositories import ProjectRepository
from src.services import MongoDatabase
from src.services.seed_data import PROJECTS


async def apply_media(dry_run: bool) -> int:
    repository = ProjectRepository()
    updated = 0

    for seed in PROJECTS:
        if not seed.gallery:
            continue

        project = await repository.find_one({"slug": seed.slug})
        if project is None:
            print(f"  bỏ qua — không tìm thấy dự án: {seed.slug}")
            continue

        if project.cover == seed.cover and project.gallery == seed.gallery:
            print(f"  không đổi: {seed.slug}")
            continue

        print(f"  cập nhật {seed.slug}: {len(seed.gallery)} ảnh (cover + gallery)")
        updated += 1
        if not dry_run:
            await repository.update(project, {"cover": seed.cover, "gallery": seed.gallery})

    return updated


async def main_async(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    if dry_run:
        print("CHẾ ĐỘ THỬ — không ghi gì lên database\n")

    database = MongoDatabase()
    await database.connect()
    try:
        updated = await apply_media(dry_run)
    finally:
        await database.close()

    print(f"\n  {updated} dự án được cập nhật ảnh")
    if dry_run:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

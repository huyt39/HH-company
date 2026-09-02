"""Push the project photos declared in `seed_data` into an already-seeded database.

    python -m scripts.apply_project_images --dry-run   # report what would change
    python -m scripts.apply_project_images             # apply

`SeedService` only runs against an empty database, so photos added to the seed
file never reach a database that has already been seeded. This script closes
that gap: it matches on slug and writes `cover` / `gallery`.

Safe to re-run — a project already holding the same media is left alone.

It also drops records left pointing at photos the seed no longer ships, which
is what happens when a photo is deleted from `frontend/public/images/`: the
database would otherwise keep serving a URL that now 404s. Only media under
`/images/` is considered, so anything uploaded through the admin (which lands
under `/uploads/` or on Blob storage) survives untouched.
"""

import asyncio
import sys
from urllib.parse import urlsplit

from src.configs import mongo_config
from src.repositories import ProjectRepository
from src.services import MongoDatabase
from src.services.seed_data import PROJECTS


def target_description() -> str:
    """Host and database being written to, with any credentials stripped.

    Local and production commonly share a database name, so printing the name
    alone is not enough to tell which one a run is about to modify.
    """
    host = urlsplit(mongo_config.MONGODB_URL).hostname or "?"
    return f"{host} / {mongo_config.MONGODB_DB_NAME}"


# Photos shipped with the frontend all live under this prefix; admin uploads do not.
SEED_MEDIA_PREFIX = "/images/"


def seed_media_urls() -> set[str]:
    """Every photo URL the seed file still ships."""
    return {
        item["url"] if isinstance(item, dict) else item.url
        for seed in PROJECTS
        for item in seed.gallery or []
    }


def _is_stale(media, known: set[str]) -> bool:
    url = media.url if hasattr(media, "url") else media.get("url", "")
    return url.startswith(SEED_MEDIA_PREFIX) and url not in known


async def drop_stale_media(dry_run: bool) -> int:
    """Clear media the seed no longer ships, leaving admin uploads alone."""
    repository = ProjectRepository()
    known = seed_media_urls()
    cleared = 0

    for seed in PROJECTS:
        project = await repository.find_one({"slug": seed.slug})
        if project is None:
            continue

        gallery = [m for m in (project.gallery or []) if not _is_stale(m, known)]
        cover = project.cover
        if cover is not None and _is_stale(cover, known):
            cover = gallery[0] if gallery else None

        if len(gallery) == len(project.gallery or []) and cover is project.cover:
            continue

        removed = len(project.gallery or []) - len(gallery)
        print(f"  dọn {seed.slug}: bỏ {removed} ảnh không còn tồn tại")
        cleared += 1
        if not dry_run:
            await repository.update(project, {"cover": cover, "gallery": gallery})

    return cleared


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
    print(f"Đích: {target_description()}")
    if dry_run:
        print("CHẾ ĐỘ THỬ — không ghi gì lên database")
    print()

    database = MongoDatabase()
    await database.connect()
    try:
        cleared = await drop_stale_media(dry_run)
        updated = await apply_media(dry_run)
    finally:
        await database.close()

    print(f"\n  {updated} dự án được cập nhật ảnh, {cleared} dự án được dọn ảnh cũ")
    if dry_run:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

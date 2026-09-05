"""Push the product illustrations declared in `seed_data` into a seeded database.

    python -m scripts.apply_product_images --dry-run
    python -m scripts.apply_product_images

Same gap as `apply_project_images`: `SeedService` runs only against an empty
database, so an `image` added to the seed file never reaches one already seeded.
Matches on slug and writes `image`, nothing else.

Safe to re-run. A product whose picture was replaced through /admin is left
alone unless the seed carries a different one for that slug.
"""

import asyncio
import sys
from urllib.parse import urlsplit

from src.configs import mongo_config
from src.repositories import ProductRepository
from src.services import MongoDatabase
from src.services.seed_data import PRODUCTS


def target_description() -> str:
    host = urlsplit(mongo_config.MONGODB_URL).hostname or "?"
    return f"{host} / {mongo_config.MONGODB_DB_NAME}"


async def apply_images(dry_run: bool) -> int:
    repository = ProductRepository()
    updated = 0

    for seed in PRODUCTS:
        if seed.image is None:
            continue

        product = await repository.find_one({"slug": seed.slug})
        if product is None:
            print(f"  bỏ qua — không tìm thấy nhóm sản phẩm: {seed.slug}")
            continue

        image = seed.image.model_dump()
        if product.image == image:
            print(f"  không đổi: {seed.slug}")
            continue

        print(f"  cập nhật {seed.slug}")
        updated += 1
        if not dry_run:
            await repository.update(product, {"image": image})

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
        updated = await apply_images(dry_run)
    finally:
        await database.close()

    print(f"\n  {updated} nhóm sản phẩm được cập nhật ảnh")
    if dry_run and updated:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

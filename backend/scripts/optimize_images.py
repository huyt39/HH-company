"""Re-compress existing images in the uploads directory and build thumbnails.

    python -m scripts.optimize_images --dry-run   # report savings only
    python -m scripts.optimize_images             # apply

Files are overwritten in place so database URLs stay valid; the script only
adds a `thumb` key to cover/gallery records pointing at those images.

Local disk storage only — on Vercel Blob every image is already compressed
at upload time.
"""

import asyncio
import sys

from src.configs import storage_config
from src.repositories import BusinessFieldRepository, NewsRepository, ProjectRepository
from src.services import MongoDatabase
from src.services.image_service import detect_kind, process
from src.services.storage_service import THUMB_SUFFIX

UPLOAD_DIR = storage_config.upload_path


def _human(size: int) -> str:
    return f"{size / 1024:.0f}KB" if size < 1024 * 1024 else f"{size / 1024 / 1024:.1f}MB"


def optimize_files(dry_run: bool) -> dict[str, str]:
    """Compress each image. Returns {image_url: thumb_url} for the database pass."""
    thumbs: dict[str, str] = {}
    before_total = after_total = 0
    changed = 0

    targets = sorted(
        path
        for path in UPLOAD_DIR.iterdir()
        if path.is_file() and not path.name.startswith(".") and THUMB_SUFFIX not in path.stem
    )

    for path in targets:
        data = path.read_bytes()
        kind = detect_kind(data)
        if kind is None:
            print(f"  bỏ qua (không phải ảnh): {path.name}")
            continue

        try:
            result = process(data, kind)
        except Exception as exc:
            print(f"  lỗi {path.name}: {exc}")
            continue

        before_total += len(data)
        after_total += len(result.full)

        thumb_path = UPLOAD_DIR / f"{path.stem}{THUMB_SUFFIX}{path.suffix}"
        if result.thumb:
            thumbs[f"/uploads/{path.name}"] = f"/uploads/{thumb_path.name}"

        if len(result.full) < len(data) or (result.thumb and not thumb_path.exists()):
            changed += 1
            arrow = f"{_human(len(data))} -> {_human(len(result.full))}"
            print(f"  {path.name[:52]:54} {arrow:>18}  {result.width}x{result.height}")
            if not dry_run:
                # Overwrite under the same name so database URLs keep working.
                path.write_bytes(result.full)
                if result.thumb:
                    thumb_path.write_bytes(result.thumb)

    saved = before_total - after_total
    percent = round(saved / before_total * 100) if before_total else 0
    print(
        f"\n  {len(targets)} ảnh, {changed} ảnh thay đổi: "
        f"{_human(before_total)} -> {_human(after_total)} (tiết kiệm {_human(saved)}, {percent}%)"
    )
    return thumbs


def _patch_media(media: dict | None, thumbs: dict[str, str]) -> tuple[dict | None, bool]:
    if not media or "url" not in media:
        return media, False
    thumb = thumbs.get(media["url"])
    if not thumb or media.get("thumb") == thumb:
        return media, False
    return {**media, "thumb": thumb}, True


async def update_database(thumbs: dict[str, str], dry_run: bool) -> int:
    """Add the `thumb` key to cover/gallery records."""
    updated = 0

    for repository in (ProjectRepository(), NewsRepository(), BusinessFieldRepository()):
        for row in await repository.find_many():
            changes: dict = {}

            cover, cover_changed = _patch_media(row.cover, thumbs)
            if cover_changed:
                changes["cover"] = cover

            gallery = getattr(row, "gallery", None)
            if gallery:
                patched = [_patch_media(item, thumbs) for item in gallery]
                if any(flag for _, flag in patched):
                    changes["gallery"] = [item for item, _ in patched]

            if changes:
                updated += 1
                if not dry_run:
                    await repository.update(row, changes)

    return updated


async def main_async(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    if dry_run:
        print("CHẾ ĐỘ THỬ — không ghi gì lên đĩa hay database\n")

    if storage_config.use_blob:
        print("Đang cấu hình lưu ảnh trên Vercel Blob — script này chỉ dùng cho ảnh trên đĩa.", file=sys.stderr)
        return 1

    if not UPLOAD_DIR.is_dir():
        print(f"Không tìm thấy thư mục ảnh: {UPLOAD_DIR}", file=sys.stderr)
        return 1

    thumbs = optimize_files(dry_run)

    database = MongoDatabase()
    await database.connect()
    try:
        updated = await update_database(thumbs, dry_run)
    finally:
        await database.close()
    print(f"  {updated} bản ghi được gắn thumbnail")

    if dry_run:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

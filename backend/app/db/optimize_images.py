"""Nén lại ảnh đã có trong thư mục uploads và sinh thumbnail.

    python -m app.db.optimize_images --dry-run   # chỉ xem sẽ tiết kiệm bao nhiêu
    python -m app.db.optimize_images             # thực hiện

Ảnh được ghi đè tại chỗ nên URL trong database không đổi; chỉ bổ sung khoá
`thumb` vào các bản ghi cover/gallery đang trỏ tới ảnh đó.
"""

import sys
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models import BusinessField, NewsItem, Project
from app.services import images
from app.api.v1.admin.uploads import THUMB_SUFFIX, _detect_type

UPLOAD_DIR = settings.upload_path


def _human(size: int) -> str:
    return f"{size / 1024:.0f}KB" if size < 1024 * 1024 else f"{size / 1024 / 1024:.1f}MB"


def optimize_files(dry_run: bool) -> dict[str, str]:
    """Nén từng ảnh. Trả về map {url_ảnh: url_thumb} để cập nhật database."""
    thumbs: dict[str, str] = {}
    before_total = after_total = 0
    changed = 0

    targets = sorted(
        p for p in UPLOAD_DIR.iterdir()
        if p.is_file() and not p.name.startswith(".") and THUMB_SUFFIX not in p.stem
    )

    for path in targets:
        data = path.read_bytes()
        kind = _detect_type(data)
        if kind is None:
            print(f"  bỏ qua (không phải ảnh): {path.name}")
            continue

        try:
            result = images.process(data, kind)
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
                # Ghi đè đúng tên cũ để URL trong database không bị hỏng.
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


def update_database(db: Session, thumbs: dict[str, str], dry_run: bool) -> int:
    """Bổ sung khoá `thumb` vào các bản ghi cover/gallery."""
    updated = 0

    for model in (Project, NewsItem, BusinessField):
        for row in db.scalars(select(model)).all():
            touched = False

            cover, changed = _patch_media(row.cover, thumbs)
            if changed:
                row.cover = cover
                touched = True

            if hasattr(row, "gallery") and row.gallery:
                new_gallery, any_changed = [], False
                for item in row.gallery:
                    patched, changed = _patch_media(item, thumbs)
                    new_gallery.append(patched)
                    any_changed = any_changed or changed
                if any_changed:
                    row.gallery = new_gallery
                    touched = True

            if touched:
                updated += 1

    if dry_run:
        db.rollback()
    else:
        db.commit()
    return updated


def main(argv: list[str]) -> int:
    dry_run = "--dry-run" in argv
    if dry_run:
        print("CHẾ ĐỘ THỬ — không ghi gì lên đĩa hay database\n")

    if not UPLOAD_DIR.is_dir():
        print(f"Không tìm thấy thư mục ảnh: {UPLOAD_DIR}", file=sys.stderr)
        return 1

    thumbs = optimize_files(dry_run)

    with SessionLocal() as db:
        updated = update_database(db, thumbs, dry_run)
    print(f"  {updated} bản ghi được gắn thumbnail")

    if dry_run:
        print("\nChạy lại không kèm --dry-run để thực hiện.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

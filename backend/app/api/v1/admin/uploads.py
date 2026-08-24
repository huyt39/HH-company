"""Tải ảnh lên cho trang quản trị.

Ảnh lưu vào `data/uploads/` và phục vụ tĩnh qua `/uploads/...`. Đủ dùng cho
quy mô một website giới thiệu; khi cần scale thì đổi sang S3/R2 mà không phải
sửa phía frontend vì response vẫn chỉ trả về một URL.
"""

import hashlib
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.core.config import settings
from app.services import images

router = APIRouter(dependencies=[Depends(get_current_user)])

# Giới hạn file tải lên; sau khi nén sẽ nhỏ hơn nhiều.
MAX_BYTES = 20 * 1024 * 1024
# Chỉ nhận định dạng ảnh web thông dụng — chặn SVG vì SVG có thể chứa script.
ALLOWED = {"jpeg": ".jpg", "png": ".png", "gif": ".gif", "webp": ".webp"}
UPLOAD_DIR = settings.upload_path
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

_SAFE_NAME = re.compile(r"[^a-z0-9]+")
THUMB_SUFFIX = "-thumb"


class UploadOut(BaseModel):
    url: str
    thumb: str | None = None
    filename: str
    size: int
    width: int | None = None
    height: int | None = None
    original_size: int | None = None
    saved_percent: int | None = None


class FileItem(BaseModel):
    url: str
    thumb: str | None = None
    filename: str
    size: int
    modified: datetime


def _detect_type(data: bytes) -> str | None:
    """Nhận dạng theo magic byte, không tin phần mở rộng do client gửi.

    Tự kiểm tra thay vì dùng `imghdr` vì module đó đã bị xoá khỏi Python 3.13.
    """
    if data[:3] == b"\xff\xd8\xff":
        return "jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


def _slugify(value: str) -> str:
    """Bỏ dấu tiếng Việt rồi rút về a-z0-9 và dấu gạch ngang."""
    value = value.replace("đ", "d").replace("Đ", "D")
    stripped = "".join(
        c for c in unicodedata.normalize("NFD", value) if not unicodedata.combining(c)
    )
    return _SAFE_NAME.sub("-", stripped.lower()).strip("-")


def _build_name(original: str, data: bytes, extension: str) -> str:
    # Hash nội dung để tên là duy nhất và upload trùng file không tạo bản sao.
    stem = _slugify(Path(original).stem)[:60] or "anh"
    digest = hashlib.sha1(data).hexdigest()[:8]
    return f"{stem}-{digest}{extension}"


@router.post("", response_model=UploadOut, status_code=201, summary="Tải ảnh lên")
async def upload_image(file: UploadFile = File(...)):
    data = await file.read()

    if not data:
        raise HTTPException(status_code=400, detail="File rỗng")
    if len(data) > MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Ảnh vượt quá {MAX_BYTES // 1024 // 1024} MB",
        )

    kind = _detect_type(data)
    if kind is None:
        raise HTTPException(
            status_code=400, detail="Chỉ nhận ảnh JPG, PNG, GIF hoặc WEBP"
        )

    try:
        processed = images.process(data, kind)
    except Exception as exc:  # ảnh hỏng / cắt dở
        raise HTTPException(status_code=400, detail="Không đọc được ảnh này") from exc

    # Hash tính trên bản đã nén để tên phản ánh đúng nội dung được lưu.
    name = _build_name(file.filename or "anh", processed.full, processed.extension)
    target = UPLOAD_DIR / name
    if not target.exists():
        target.write_bytes(processed.full)

    thumb_url = None
    if processed.thumb:
        thumb_name = f"{Path(name).stem}{THUMB_SUFFIX}{processed.extension}"
        thumb_target = UPLOAD_DIR / thumb_name
        if not thumb_target.exists():
            thumb_target.write_bytes(processed.thumb)
        thumb_url = f"/uploads/{thumb_name}"

    return UploadOut(
        url=f"/uploads/{name}",
        thumb=thumb_url,
        filename=name,
        size=len(processed.full),
        width=processed.width,
        height=processed.height,
        original_size=processed.original_size,
        saved_percent=processed.saved_percent,
    )


@router.get("", response_model=list[FileItem], summary="Danh sách ảnh đã tải")
def list_images(limit: int = Query(200, ge=1, le=1000)):
    # Bản thumbnail không liệt kê riêng — nó đi kèm ảnh gốc.
    files = sorted(
        (
            p
            for p in UPLOAD_DIR.iterdir()
            if p.is_file() and not p.name.startswith(".") and THUMB_SUFFIX not in p.stem
        ),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    result = []
    for p in files[:limit]:
        thumb = UPLOAD_DIR / f"{p.stem}{THUMB_SUFFIX}{p.suffix}"
        result.append(
            FileItem(
                url=f"/uploads/{p.name}",
                thumb=f"/uploads/{thumb.name}" if thumb.exists() else None,
                filename=p.name,
                size=p.stat().st_size,
                modified=datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc),
            )
        )
    return result


@router.delete("/{filename}", status_code=204, summary="Xoá ảnh")
def delete_image(filename: str):
    # Chặn path traversal: chỉ cho phép tên file trần.
    if "/" in filename or "\\" in filename or filename.startswith("."):
        raise HTTPException(status_code=400, detail="Tên file không hợp lệ")

    target = (UPLOAD_DIR / filename).resolve()
    if not target.is_relative_to(UPLOAD_DIR.resolve()) or not target.is_file():
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    target.unlink()

    # Xoá kèm bản thumbnail nếu có.
    thumb = UPLOAD_DIR / f"{target.stem}{THUMB_SUFFIX}{target.suffix}"
    if thumb.is_file():
        thumb.unlink()

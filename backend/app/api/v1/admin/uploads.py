"""Tải ảnh lên cho trang quản trị.

Môi trường local: lưu vào `data/uploads/` và phục vụ tĩnh qua `/uploads/...`.
Môi trường Vercel (BLOB_READ_WRITE_TOKEN khác rỗng): tải lên Vercel Blob Storage,
trả về URL công khai từ blob.vercel-storage.com.

Khi cần scale thêm: đổi sang S3/R2/Cloudinary mà không phải sửa frontend
vì response vẫn chỉ trả về một URL.
"""

import hashlib
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

import httpx
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
THUMB_SUFFIX = "-thumb"

_SAFE_NAME = re.compile(r"[^a-z0-9]+")

# Vercel Blob endpoint
_BLOB_API = "https://blob.vercel-storage.com"


def _use_blob() -> bool:
    """True nếu đang chạy trên Vercel với Blob token được cấu hình."""
    return bool(settings.BLOB_READ_WRITE_TOKEN)


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
    """Nhận dạng theo magic byte, không tin phần mở rộng do client gửi."""
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
    stem = _slugify(Path(original).stem)[:60] or "anh"
    digest = hashlib.sha1(data).hexdigest()[:8]
    return f"{stem}-{digest}{extension}"


async def _blob_put(filename: str, data: bytes, content_type: str) -> str:
    """Upload lên Vercel Blob, trả về public URL."""
    headers = {
        "authorization": f"Bearer {settings.BLOB_READ_WRITE_TOKEN}",
        "x-api-version": "7",
        "x-content-type": content_type,
        "content-type": "application/octet-stream",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.put(
            f"{_BLOB_API}/{filename}",
            content=data,
            headers=headers,
            timeout=60,
        )
        if resp.status_code not in (200, 201):
            raise HTTPException(status_code=500, detail=f"Blob upload lỗi: {resp.text}")
        return resp.json()["url"]


async def _blob_list() -> list[dict]:
    """Liệt kê file trong Vercel Blob."""
    headers = {"authorization": f"Bearer {settings.BLOB_READ_WRITE_TOKEN}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{_BLOB_API}?limit=200", headers=headers, timeout=30)
        if resp.status_code != 200:
            return []
        return resp.json().get("blobs", [])


async def _blob_delete(url: str) -> None:
    """Xoá file khỏi Vercel Blob theo URL."""
    headers = {
        "authorization": f"Bearer {settings.BLOB_READ_WRITE_TOKEN}",
        "content-type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        await client.delete(f"{_BLOB_API}?url={url}", headers=headers, timeout=30)


# ─────────────────────────────────────────── ROUTES ──────────────────────────

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
        raise HTTPException(status_code=400, detail="Chỉ nhận ảnh JPG, PNG, GIF hoặc WEBP")

    try:
        processed = images.process(data, kind)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Không đọc được ảnh này") from exc

    name = _build_name(file.filename or "anh", processed.full, processed.extension)
    content_type_map = {".jpg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp"}
    ct = content_type_map.get(processed.extension, "image/jpeg")

    if _use_blob():
        # ── Vercel Blob ──────────────────────────────────────────────────────
        url = await _blob_put(name, processed.full, ct)
        thumb_url = None
        if processed.thumb:
            thumb_name = f"{Path(name).stem}{THUMB_SUFFIX}{processed.extension}"
            thumb_url = await _blob_put(thumb_name, processed.thumb, ct)
    else:
        # ── Local filesystem ─────────────────────────────────────────────────
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
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

        url = f"/uploads/{name}"

    return UploadOut(
        url=url,
        thumb=thumb_url,
        filename=name,
        size=len(processed.full),
        width=processed.width,
        height=processed.height,
        original_size=processed.original_size,
        saved_percent=processed.saved_percent,
    )


@router.get("", response_model=list[FileItem], summary="Danh sách ảnh đã tải")
async def list_images(limit: int = Query(200, ge=1, le=1000)):
    if _use_blob():
        blobs = await _blob_list()
        result = []
        for b in blobs:
            name = b.get("pathname", "")
            if THUMB_SUFFIX in name:
                continue
            thumb_name = f"{Path(name).stem}{THUMB_SUFFIX}{Path(name).suffix}"
            thumb_url = next((x["url"] for x in blobs if x.get("pathname") == thumb_name), None)
            result.append(
                FileItem(
                    url=b["url"],
                    thumb=thumb_url,
                    filename=name,
                    size=b.get("size", 0),
                    modified=datetime.fromisoformat(b.get("uploadedAt", "2000-01-01T00:00:00Z").replace("Z", "+00:00")),
                )
            )
        return result[:limit]
    else:
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
async def delete_image(filename: str):
    if _use_blob():
        # Reconstruct URL từ filename
        blobs = await _blob_list()
        target = next((b for b in blobs if b.get("pathname") == filename), None)
        if not target:
            raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
        await _blob_delete(target["url"])
        # Xoá thumbnail
        thumb_name = f"{Path(filename).stem}{THUMB_SUFFIX}{Path(filename).suffix}"
        thumb = next((b for b in blobs if b.get("pathname") == thumb_name), None)
        if thumb:
            await _blob_delete(thumb["url"])
    else:
        if "/" in filename or "\\" in filename or filename.startswith("."):
            raise HTTPException(status_code=400, detail="Tên file không hợp lệ")
        target = (UPLOAD_DIR / filename).resolve()
        if not target.is_relative_to(UPLOAD_DIR.resolve()) or not target.is_file():
            raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
        target.unlink()
        thumb = UPLOAD_DIR / f"{target.stem}{THUMB_SUFFIX}{target.suffix}"
        if thumb.is_file():
            thumb.unlink()

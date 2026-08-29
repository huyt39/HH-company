"""Where admin-uploaded images live.

Two backends behind one interface, picked by configuration:

- Local — written to `data/uploads/`, served statically at `/uploads/...`.
- Vercel Blob — used when `BLOB_READ_WRITE_TOKEN` is set.

Routers only ever talk to `StorageService`, so moving to S3/R2/Cloudinary later
means adding one `ImageStorage` subclass, with no change to endpoints or the
frontend.
"""

import hashlib
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

import httpx
from fastapi import HTTPException, status

from src.configs import storage_config
from src.services.image_service import ProcessedImage
from src.types import StoredFile, UploadResponse
from src.utils import Logger, slugify

logger = Logger("storage_service")

# A thumbnail reuses the original name plus this suffix.
THUMB_SUFFIX = "-thumb"

BLOB_API = "https://blob.vercel-storage.com"


@dataclass
class RawFile:
    """A file in the store, before originals and thumbnails are paired up."""

    filename: str
    url: str
    size: int
    modified: datetime


def build_filename(original_name: str, data: bytes, extension: str) -> str:
    """Safe filename with an 8-char content hash, so same-named files never clash."""
    stem = slugify(Path(original_name).stem)[:60] or "anh"
    digest = hashlib.sha1(data).hexdigest()[:8]
    return f"{stem}-{digest}{extension}"


def thumb_name_of(filename: str) -> str:
    path = Path(filename)
    return f"{path.stem}{THUMB_SUFFIX}{path.suffix}"


# --------------------------------------------------------------------------- #
# Shared interface
# --------------------------------------------------------------------------- #

class ImageStorage(ABC):
    @abstractmethod
    async def put(self, filename: str, data: bytes, content_type: str) -> str:
        """Write a file and return its public URL."""

    @abstractmethod
    async def list_files(self) -> list[RawFile]:
        """List every file, newest first."""

    @abstractmethod
    async def remove(self, filename: str) -> bool:
        """Delete a file; False when it does not exist."""


# --------------------------------------------------------------------------- #
# Local filesystem
# --------------------------------------------------------------------------- #

class LocalImageStorage(ImageStorage):
    def __init__(self, root: Path | None = None) -> None:
        self.root = root or storage_config.upload_path

    def _safe_path(self, filename: str) -> Path:
        """Block path traversal: the file must resolve inside the uploads dir."""
        if "/" in filename or "\\" in filename or filename.startswith("."):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Tên file không hợp lệ"
            )
        target = (self.root / filename).resolve()
        if not target.is_relative_to(self.root.resolve()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Tên file không hợp lệ"
            )
        return target

    async def put(self, filename: str, data: bytes, content_type: str) -> str:
        self.root.mkdir(parents=True, exist_ok=True)
        target = self._safe_path(filename)
        # The name carries a content hash, so a name clash means identical bytes.
        if not target.exists():
            target.write_bytes(data)
        return f"/uploads/{filename}"

    async def list_files(self) -> list[RawFile]:
        if not self.root.is_dir():
            return []
        files = [
            path
            for path in self.root.iterdir()
            if path.is_file() and not path.name.startswith(".")
        ]
        files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
        return [
            RawFile(
                filename=path.name,
                url=f"/uploads/{path.name}",
                size=path.stat().st_size,
                modified=datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc),
            )
            for path in files
        ]

    async def remove(self, filename: str) -> bool:
        target = self._safe_path(filename)
        if not target.is_file():
            return False
        target.unlink()
        return True


# --------------------------------------------------------------------------- #
# Vercel Blob
# --------------------------------------------------------------------------- #

class BlobImageStorage(ImageStorage):
    def __init__(self, token: str | None = None) -> None:
        self.token = token or storage_config.BLOB_READ_WRITE_TOKEN

    def _headers(self, **extra: str) -> dict[str, str]:
        return {"authorization": f"Bearer {self.token}", **extra}

    async def put(self, filename: str, data: bytes, content_type: str) -> str:
        headers = self._headers(
            **{
                "x-api-version": "7",
                "x-content-type": content_type,
                "content-type": "application/octet-stream",
            }
        )
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.put(f"{BLOB_API}/{filename}", content=data, headers=headers)
        if response.status_code not in (200, 201):
            logger.error(f"Blob upload failed {response.status_code}: {response.text}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY, detail="Không tải được ảnh lên kho lưu trữ"
            )
        return response.json()["url"]

    async def list_files(self) -> list[RawFile]:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(f"{BLOB_API}?limit=1000", headers=self._headers())
        if response.status_code != 200:
            logger.error(f"Blob list failed {response.status_code}: {response.text}")
            return []

        files = [
            RawFile(
                filename=blob.get("pathname", ""),
                url=blob["url"],
                size=blob.get("size", 0),
                modified=datetime.fromisoformat(
                    blob.get("uploadedAt", "2000-01-01T00:00:00Z").replace("Z", "+00:00")
                ),
            )
            for blob in response.json().get("blobs", [])
        ]
        files.sort(key=lambda f: f.modified, reverse=True)
        return files

    async def remove(self, filename: str) -> bool:
        target = next((f for f in await self.list_files() if f.filename == filename), None)
        if target is None:
            return False
        async with httpx.AsyncClient(timeout=30) as client:
            await client.delete(
                f"{BLOB_API}?url={target.url}",
                headers=self._headers(**{"content-type": "application/json"}),
            )
        return True


# --------------------------------------------------------------------------- #
# Business logic over the image store
# --------------------------------------------------------------------------- #

class StorageService:
    """Pairs originals with thumbnails and returns API response types."""

    def __init__(self, backend: ImageStorage | None = None) -> None:
        self.backend = backend or (
            BlobImageStorage() if storage_config.use_blob else LocalImageStorage()
        )

    async def save_image(self, original_name: str, image: ProcessedImage) -> UploadResponse:
        filename = build_filename(original_name, image.full, image.extension)
        url = await self.backend.put(filename, image.full, image.content_type)

        thumb_url = None
        if image.thumb:
            thumb_url = await self.backend.put(
                thumb_name_of(filename), image.thumb, image.content_type
            )

        return UploadResponse(
            url=url,
            thumb=thumb_url,
            filename=filename,
            size=len(image.full),
            width=image.width,
            height=image.height,
            original_size=image.original_size,
            saved_percent=image.saved_percent,
        )

    async def list_images(self, limit: int = 200) -> list[StoredFile]:
        files = await self.backend.list_files()
        thumbs = {f.filename: f.url for f in files if THUMB_SUFFIX in Path(f.filename).stem}

        return [
            StoredFile(
                url=f.url,
                thumb=thumbs.get(thumb_name_of(f.filename)),
                filename=f.filename,
                size=f.size,
                modified=f.modified,
            )
            for f in files
            if THUMB_SUFFIX not in Path(f.filename).stem
        ][:limit]

    async def delete_image(self, filename: str) -> None:
        """Delete an image along with its thumbnail."""
        if not await self.backend.remove(filename):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy ảnh"
            )
        await self.backend.remove(thumb_name_of(filename))

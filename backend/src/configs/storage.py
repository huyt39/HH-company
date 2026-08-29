from pathlib import Path

from src.configs.base import BASE_DIR, EnvConfig


class StorageConfig(EnvConfig):
    """Where admin-uploaded images are kept.

    Local: written to `UPLOAD_DIR` and served statically at `/uploads/...`.
    Vercel: with `BLOB_READ_WRITE_TOKEN` set, pushed to Vercel Blob Storage.
    """

    UPLOAD_DIR: str = "./data/uploads"
    BLOB_READ_WRITE_TOKEN: str = ""

    # Cap on the incoming file; the stored version is much smaller.
    MAX_UPLOAD_BYTES: int = 20 * 1024 * 1024

    @property
    def use_blob(self) -> bool:
        return bool(self.BLOB_READ_WRITE_TOKEN)

    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        return path if path.is_absolute() else (BASE_DIR / path).resolve()

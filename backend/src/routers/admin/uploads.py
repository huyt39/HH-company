"""Image upload for the admin UI.

`StorageService` decides where files land (local disk or Vercel Blob); the
endpoints only validate input and delegate.
"""

from fastapi import APIRouter, File, HTTPException, Query, UploadFile, status

from src.configs import storage_config
from src.dependencies import require_admin
from src.services import StorageService
from src.services.image_service import detect_kind, process
from src.types import BaseApiResponse, MessageData, StoredFile, UploadResponse
from src.utils import Logger

logger = Logger("uploads_router")

router = APIRouter(prefix="/uploads", tags=["Quản trị · Ảnh"], dependencies=[require_admin])


@router.post("", response_model=BaseApiResponse[UploadResponse], status_code=201)
async def upload_image(file: UploadFile = File(...)):
    """Upload one image: validate, compress, strip metadata, then store."""
    data = await file.read()

    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File rỗng")
    if len(data) > storage_config.MAX_UPLOAD_BYTES:
        limit_mb = storage_config.MAX_UPLOAD_BYTES // 1024 // 1024
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Ảnh vượt quá {limit_mb} MB",
        )

    kind = detect_kind(data)
    if kind is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ nhận ảnh JPG, PNG, GIF hoặc WEBP",
        )

    try:
        processed = process(data, kind)
    except Exception as exc:
        logger.error(f"Could not process image {file.filename}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Không đọc được ảnh này"
        ) from exc

    result = await StorageService().save_image(file.filename or "anh", processed)
    logger.info(f"Uploaded {result.filename} ({result.size} bytes)")
    return BaseApiResponse(detail="Đã tải ảnh lên", data=result)


ALLOWED_DOC_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip", ".rar", ".7z", ".txt"}
MAX_DOC_BYTES = 50 * 1024 * 1024  # 50 MB


@router.post("/file", response_model=BaseApiResponse[UploadResponse], status_code=201)
async def upload_document(file: UploadFile = File(...)):
    """Upload one document file (PDF, Word, Excel, ZIP, etc.)."""
    data = await file.read()

    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File rỗng")
    if len(data) > MAX_DOC_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File vượt quá 50 MB",
        )

    filename = file.filename or "tai-lieu.pdf"
    ext = filename.lower()[filename.rfind("."):] if "." in filename else ""
    if ext not in ALLOWED_DOC_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng file không được hỗ trợ (chấp nhận: {', '.join(sorted(ALLOWED_DOC_EXTENSIONS))})",
        )

    content_type = file.content_type or "application/octet-stream"
    result = await StorageService().save_file(filename, data, content_type)
    logger.info(f"Uploaded document {result.filename} ({result.size} bytes)")
    return BaseApiResponse(detail="Đã tải tài liệu lên", data=result)



@router.get("", response_model=BaseApiResponse[list[StoredFile]])
async def list_images(limit: int = Query(200, ge=1, le=1000)):
    """List uploaded images, newest first."""
    return BaseApiResponse(detail="Thư viện ảnh", data=await StorageService().list_images(limit))


@router.delete("/{filename}", response_model=BaseApiResponse[MessageData])
async def delete_image(filename: str):
    """Delete an image together with its thumbnail."""
    await StorageService().delete_image(filename)
    logger.info(f"Deleted image {filename}")
    return BaseApiResponse(detail="Đã xoá ảnh", data=MessageData(message="Đã xoá ảnh"))

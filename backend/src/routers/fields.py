"""Construction services — public."""

from fastapi import APIRouter, HTTPException, status

from src.services import ContentService
from src.types import BaseApiResponse, BusinessFieldResponse

router = APIRouter(prefix="/fields", tags=["Dịch vụ thi công"])


@router.get("", response_model=BaseApiResponse[list[BusinessFieldResponse]])
async def list_fields():
    """List published construction services."""
    return BaseApiResponse(detail="Dịch vụ thi công", data=await ContentService().list_fields())


@router.get("/{slug}", response_model=BaseApiResponse[BusinessFieldResponse])
async def get_field(slug: str):
    """One service, with its process, standards and handover documents."""
    service = await ContentService().get_field(slug)
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy dịch vụ")
    return BaseApiResponse(detail="Dịch vụ thi công", data=service)

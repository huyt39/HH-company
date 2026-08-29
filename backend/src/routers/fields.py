"""Business fields — public."""

from fastapi import APIRouter

from src.services import ContentService
from src.types import BaseApiResponse, BusinessFieldResponse

router = APIRouter(prefix="/fields", tags=["Lĩnh vực"])


@router.get("", response_model=BaseApiResponse[list[BusinessFieldResponse]])
async def list_fields():
    """List published business fields."""
    return BaseApiResponse(detail="Lĩnh vực hoạt động", data=await ContentService().list_fields())

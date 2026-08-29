"""Product groups — public."""

from fastapi import APIRouter, HTTPException, status

from src.services import ContentService
from src.types import BaseApiResponse, ProductResponse

router = APIRouter(prefix="/products", tags=["Sản phẩm"])


@router.get("", response_model=BaseApiResponse[list[ProductResponse]])
async def list_products():
    """List published product groups."""
    return BaseApiResponse(detail="Danh mục sản phẩm", data=await ContentService().list_products())


@router.get("/{slug}", response_model=BaseApiResponse[ProductResponse])
async def get_product(slug: str):
    """Get one product group by slug."""
    item = await ContentService().get_product(slug)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy nhóm sản phẩm"
        )
    return BaseApiResponse(detail="Chi tiết nhóm sản phẩm", data=item)

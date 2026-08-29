"""News — public."""

from fastapi import APIRouter, HTTPException, Query, status

from src.services import ContentService
from src.types import BaseApiResponse, NewsResponse, Page

router = APIRouter(prefix="/news", tags=["Tin tức"])


@router.get("", response_model=BaseApiResponse[Page[NewsResponse]])
async def list_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: str | None = Query(None),
):
    """List articles, paginated and filterable by category."""
    data = await ContentService().list_news(page=page, page_size=page_size, category=category)
    return BaseApiResponse(detail="Danh sách tin tức", data=data)


@router.get("/{slug}", response_model=BaseApiResponse[NewsResponse])
async def get_news(slug: str):
    """Get one article by slug."""
    item = await ContentService().get_news(slug)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài viết")
    return BaseApiResponse(detail="Chi tiết bài viết", data=item)

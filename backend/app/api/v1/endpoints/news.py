from fastapi import APIRouter, HTTPException, Query

from app.schemas.common import Page
from app.schemas.content import NewsItem
from app.services import store

router = APIRouter()


@router.get("", response_model=Page[NewsItem], summary="Danh sách tin tức")
async def list_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: str | None = None,
):
    return await store.list_news(page=page, page_size=page_size, category=category)


@router.get("/{slug}", response_model=NewsItem, summary="Chi tiết tin tức")
async def get_news(slug: str):
    item = await store.get_news(slug)
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết")
    return item

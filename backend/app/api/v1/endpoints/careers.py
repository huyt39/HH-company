from fastapi import APIRouter, HTTPException, Query

from app.schemas.common import Page
from app.schemas.content import JobPosting
from app.services import store

router = APIRouter()


@router.get("", response_model=Page[JobPosting], summary="Danh sách tin tuyển dụng")
async def list_jobs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
):
    return await store.list_jobs(page=page, page_size=page_size)


@router.get("/{slug}", response_model=JobPosting, summary="Chi tiết vị trí tuyển dụng")
async def get_job(slug: str):
    item = await store.get_job(slug)
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy vị trí tuyển dụng")
    return item

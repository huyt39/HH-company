"""Job postings — public."""

from fastapi import APIRouter, HTTPException, Query, status

from src.services import ContentService
from src.types import BaseApiResponse, JobResponse, Page

router = APIRouter(prefix="/careers", tags=["Tuyển dụng"])


@router.get("", response_model=BaseApiResponse[Page[JobResponse]])
async def list_jobs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
):
    """List open positions."""
    data = await ContentService().list_jobs(page=page, page_size=page_size)
    return BaseApiResponse(detail="Danh sách tuyển dụng", data=data)


@router.get("/{slug}", response_model=BaseApiResponse[JobResponse])
async def get_job(slug: str):
    """Get one job posting by slug."""
    item = await ContentService().get_job(slug)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy vị trí tuyển dụng"
        )
    return BaseApiResponse(detail="Chi tiết vị trí tuyển dụng", data=item)

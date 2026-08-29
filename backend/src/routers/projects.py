"""Projects — public."""

from fastapi import APIRouter, HTTPException, Query, status

from src.services import ContentService
from src.types import BaseApiResponse, Page, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Dự án"])


@router.get("", response_model=BaseApiResponse[Page[ProjectResponse]])
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    status_filter: str | None = Query(
        None, alias="status", description="planning | in_progress | completed"
    ),
):
    """List projects, paginated and filterable by status."""
    data = await ContentService().list_projects(
        page=page, page_size=page_size, status=status_filter
    )
    return BaseApiResponse(detail="Danh sách dự án", data=data)


@router.get("/{slug}", response_model=BaseApiResponse[ProjectResponse])
async def get_project(slug: str):
    """Get one project by slug."""
    item = await ContentService().get_project(slug)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy dự án")
    return BaseApiResponse(detail="Chi tiết dự án", data=item)

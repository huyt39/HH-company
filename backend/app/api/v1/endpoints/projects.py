from fastapi import APIRouter, HTTPException, Query

from app.schemas.common import Page
from app.schemas.content import Project
from app.services import store

router = APIRouter()


@router.get("", response_model=Page[Project], summary="Danh sách dự án")
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    status: str | None = Query(None, description="planning | in_progress | completed"),
):
    return await store.list_projects(page=page, page_size=page_size, status=status)


@router.get("/{slug}", response_model=Project, summary="Chi tiết dự án")
async def get_project(slug: str):
    item = await store.get_project(slug)
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dự án")
    return item

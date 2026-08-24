from fastapi import APIRouter

from app.schemas.content import BusinessField
from app.services import store

router = APIRouter()


@router.get("", response_model=list[BusinessField], summary="Lĩnh vực hoạt động")
async def list_fields():
    return await store.list_fields()

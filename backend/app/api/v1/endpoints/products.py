from fastapi import APIRouter, HTTPException

from app.schemas.content import Product
from app.services import store

router = APIRouter()


@router.get("", response_model=list[Product], summary="Danh mục sản phẩm cung cấp")
async def list_products():
    return await store.list_products()


@router.get("/{slug}", response_model=Product, summary="Chi tiết nhóm sản phẩm")
async def get_product(slug: str):
    item = await store.get_product(slug)
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhóm sản phẩm")
    return item

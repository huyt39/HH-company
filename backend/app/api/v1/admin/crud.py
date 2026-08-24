"""Factory sinh router CRUD cho một collection MongoDB.

Bảy thực thể quản trị đều có cùng vòng đời (list / create / read / update /
delete / reorder) nên viết một lần rồi cấu hình, thay vì lặp bảy lần.
"""

import re
from typing import Any

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.schemas.admin import ReorderIn
from app.schemas.common import Page


def build_crud_router(
    *,
    model: Any,
    create_schema: type[BaseModel],
    update_schema: type[BaseModel],
    out_schema: type[BaseModel],
    pk: str = "id",
    default_order: tuple = (),
    searchable: tuple[str, ...] = (),
    sortable: bool = True,
) -> APIRouter:
    """Sinh router CRUD đã gắn sẵn yêu cầu đăng nhập cho mọi thao tác."""

    router = APIRouter(dependencies=[Depends(get_current_user)])

    def _doc_to_out(doc) -> out_schema:  # type: ignore[valid-type]
        data = doc.model_dump()
        data["id"] = str(doc.id)
        return out_schema.model_validate(data)

    async def _get_or_404(item_id: str):
        try:
            oid = PydanticObjectId(item_id)
        except Exception:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi")
        doc = await model.get(oid)
        if doc is None:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi")
        return doc

    # ---- GET list ---------------------------------------------------------- #

    @router.get("", response_model=Page[out_schema], summary="Danh sách")
    async def list_items(
        page: int = Query(1, ge=1),
        page_size: int = Query(50, ge=1, le=200),
        q: str | None = Query(None, description="Tìm kiếm theo từ khoá"),
    ):
        find_args = []
        if q and searchable:
            pattern = re.compile(re.escape(q), re.IGNORECASE)
            find_args.append(
                {"$or": [{field: {"$regex": pattern}} for field in searchable]}
            )

        query = model.find(*find_args)
        total = await query.count()

        # Sắp xếp: default_order là tuple[tuple[str, int], ...]
        sort_fields: list[tuple[str, int]] = list(default_order)

        cursor = query.skip((page - 1) * page_size).limit(page_size)
        if sort_fields:
            cursor = cursor.sort(sort_fields)


        rows = await cursor.to_list()
        return Page[out_schema](
            items=[_doc_to_out(r) for r in rows],
            total=total,
            page=page,
            page_size=page_size,
        )

    # ---- POST create ------------------------------------------------------- #

    @router.post("", response_model=out_schema, status_code=201, summary="Tạo mới")
    async def create_item(payload: create_schema):  # type: ignore[valid-type]
        # Kiểm tra trùng slug/key nếu model có field đó
        if hasattr(model, "slug") and hasattr(payload, "slug"):
            existing = await model.find_one(model.slug == payload.slug)  # type: ignore[attr-defined]
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Giá trị bị trùng (slug hoặc khoá chính đã tồn tại)",
                )
        doc = model(**payload.model_dump())
        await doc.insert()
        return _doc_to_out(doc)

    # ---- GET one ----------------------------------------------------------- #

    @router.get("/{item_id}", response_model=out_schema, summary="Chi tiết")
    async def read_item(item_id: str):
        return _doc_to_out(await _get_or_404(item_id))

    # ---- PATCH update ------------------------------------------------------ #

    @router.patch("/{item_id}", response_model=out_schema, summary="Cập nhật")
    async def update_item(item_id: str, payload: update_schema):  # type: ignore[valid-type]
        doc = await _get_or_404(item_id)
        update_data = payload.model_dump(exclude_unset=True)
        # Kiểm tra trùng slug nếu đang thay đổi slug
        if "slug" in update_data and update_data["slug"] != getattr(doc, "slug", None):
            if hasattr(model, "slug"):
                existing = await model.find_one(model.slug == update_data["slug"])  # type: ignore[attr-defined]
                if existing and existing.id != doc.id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Giá trị bị trùng (slug hoặc khoá chính đã tồn tại)",
                    )
        for key, value in update_data.items():
            setattr(doc, key, value)
        await doc.save()
        return _doc_to_out(doc)

    # ---- DELETE ------------------------------------------------------------ #

    @router.delete("/{item_id}", status_code=204, summary="Xoá")
    async def delete_item(item_id: str):
        doc = await _get_or_404(item_id)
        await doc.delete()

    # ---- POST reorder ------------------------------------------------------ #

    if sortable:

        @router.post("/reorder", summary="Sắp xếp lại thứ tự hiển thị")
        async def reorder(payload: ReorderIn):
            for position, item_id in enumerate(payload.ids):
                try:
                    oid = PydanticObjectId(item_id)
                except Exception:
                    continue
                doc = await model.get(oid)
                if doc is not None:
                    doc.sort_order = position
                    await doc.save()
            return {"success": True, "updated": len(payload.ids)}

    return router

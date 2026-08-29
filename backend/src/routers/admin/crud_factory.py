"""Builds a CRUD router for one content collection.

The seven admin resources (fields, products, projects, news, careers,
financials, partners) share the same lifecycle — list, create, read, update,
delete, reorder — so it is described once and configured per resource.
"""

from typing import Any

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from src.dependencies import require_admin
from src.repositories.base import BaseRepository
from src.types import BaseApiResponse, MessageData, Page, ReorderRequest
from src.utils import Logger

logger = Logger("admin_crud")

NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bản ghi"
)
DUPLICATE = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Giá trị bị trùng (slug hoặc khoá chính đã tồn tại)",
)


def build_crud_router(
    *,
    repository_class: type[BaseRepository],
    create_schema: type[BaseModel],
    update_schema: type[BaseModel],
    response_schema: type[BaseModel],
    label: str,
    sortable: bool = True,
) -> APIRouter:
    """CRUD router with login already required on every operation."""

    router = APIRouter(dependencies=[require_admin])
    repository = repository_class()
    supports_slug = "slug" in repository.model.model_fields
    # `label` is Vietnamese for API messages; logs use the model name instead.
    model_name = repository.model.__name__

    def to_response(doc) -> Any:
        return response_schema.model_validate({**doc.model_dump(), "id": str(doc.id)})

    async def get_or_404(item_id: str):
        doc = await repository.get(item_id)
        if doc is None:
            raise NOT_FOUND
        return doc

    async def ensure_slug_free(slug: str | None, *, exclude_id=None) -> None:
        if slug is None or not supports_slug:
            return
        if await repository.slug_taken(slug, exclude_id=exclude_id):
            raise DUPLICATE

    # ---- List -------------------------------------------------------------- #

    @router.get("", response_model=BaseApiResponse[Page[response_schema]])
    async def list_items(
        page: int = Query(1, ge=1),
        page_size: int = Query(50, ge=1, le=200),
        q: str | None = Query(None, description="Tìm kiếm theo từ khoá"),
    ):
        """List records, paginated and searchable."""
        rows, total = await repository.paginate(
            repository.search_filter(q), page=page, page_size=page_size
        )
        total_pages = (total + page_size - 1) // page_size if page_size else 0
        return BaseApiResponse(
            detail=f"Danh sách {label}",
            data=Page(
                items=[to_response(row) for row in rows],
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
            ),
        )

    # ---- Reorder ----------------------------------------------------------- #
    # Declared before `/{item_id}` so "reorder" is not matched as an id.

    if sortable:

        @router.post("/reorder", response_model=BaseApiResponse[MessageData])
        async def reorder(payload: ReorderRequest):
            """Reset display order from the submitted list of ids."""
            updated = 0
            for position, item_id in enumerate(payload.ids):
                doc = await repository.get(item_id)
                if doc is not None:
                    await repository.update(doc, {"sort_order": position})
                    updated += 1
            return BaseApiResponse(
                detail=f"Đã sắp xếp lại {updated} bản ghi",
                data=MessageData(message=f"Đã cập nhật {updated} bản ghi"),
            )

    # ---- Create ------------------------------------------------------------ #

    @router.post("", response_model=BaseApiResponse[response_schema], status_code=201)
    async def create_item(payload: create_schema):  # type: ignore[valid-type]
        """Create a record."""
        await ensure_slug_free(getattr(payload, "slug", None))
        doc = await repository.create(payload.model_dump())
        logger.info(f"Created {model_name} #{doc.id}")
        return BaseApiResponse(detail=f"Đã tạo {label}", data=to_response(doc))

    # ---- Read -------------------------------------------------------------- #

    @router.get("/{item_id}", response_model=BaseApiResponse[response_schema])
    async def read_item(item_id: str):
        """Get one record."""
        doc = await get_or_404(item_id)
        return BaseApiResponse(detail=f"Chi tiết {label}", data=to_response(doc))

    # ---- Update ------------------------------------------------------------ #

    @router.patch("/{item_id}", response_model=BaseApiResponse[response_schema])
    async def update_item(item_id: str, payload: update_schema):  # type: ignore[valid-type]
        """Partial update — only the submitted fields change."""
        doc = await get_or_404(item_id)
        changes = payload.model_dump(exclude_unset=True)

        new_slug = changes.get("slug")
        if new_slug is not None and new_slug != getattr(doc, "slug", None):
            await ensure_slug_free(new_slug, exclude_id=doc.id)

        await repository.update(doc, changes)
        logger.info(f"Updated {model_name} #{doc.id}")
        return BaseApiResponse(detail=f"Đã cập nhật {label}", data=to_response(doc))

    # ---- Delete ------------------------------------------------------------ #

    @router.delete("/{item_id}", response_model=BaseApiResponse[MessageData])
    async def delete_item(item_id: str):
        """Permanently delete a record."""
        doc = await get_or_404(item_id)
        await repository.delete(doc)
        logger.info(f"Deleted {model_name} #{item_id}")
        return BaseApiResponse(detail=f"Đã xoá {label}", data=MessageData(message="Đã xoá"))

    return router

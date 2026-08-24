"""Hộp thư đến từ form liên hệ — chỉ đọc, đánh dấu đã đọc và xoá."""

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import get_current_user
from app.models import ContactMessage
from app.schemas.admin import ContactMessageOut, ContactMessagePatch
from app.schemas.common import Page

router = APIRouter(dependencies=[Depends(get_current_user)])


def _to_out(doc: ContactMessage) -> ContactMessageOut:
    data = doc.model_dump()
    data["id"] = str(doc.id)
    return ContactMessageOut.model_validate(data)


@router.get("", response_model=Page[ContactMessageOut], summary="Danh sách tin nhắn")
async def list_messages(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),
    unread_only: bool = False,
):
    find_args = []
    if unread_only:
        find_args.append(ContactMessage.is_read == False)  # noqa: E712

    query = ContactMessage.find(*find_args)
    total = await query.count()
    rows = (
        await query.sort(
            [("created_at", -1), ("_id", -1)]
        )
        .skip((page - 1) * page_size)
        .limit(page_size)
        .to_list()
    )
    return Page[ContactMessageOut](
        items=[_to_out(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/unread-count", summary="Số tin chưa đọc")
async def unread_count():
    count = await ContactMessage.find(ContactMessage.is_read == False).count()  # noqa: E712
    return {"count": count}


@router.patch("/{message_id}", response_model=ContactMessageOut, summary="Đánh dấu đã đọc")
async def mark_message(message_id: str, payload: ContactMessagePatch):
    try:
        oid = PydanticObjectId(message_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin nhắn")
    row = await ContactMessage.get(oid)
    if row is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin nhắn")
    row.is_read = payload.is_read
    await row.save()
    return _to_out(row)


@router.delete("/{message_id}", status_code=204, summary="Xoá tin nhắn")
async def delete_message(message_id: str):
    try:
        oid = PydanticObjectId(message_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin nhắn")
    row = await ContactMessage.get(oid)
    if row is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy tin nhắn")
    await row.delete()

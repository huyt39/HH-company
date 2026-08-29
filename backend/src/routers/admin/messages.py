"""Contact form inbox — read, mark as read, delete."""

from fastapi import APIRouter, Query

from src.dependencies import require_admin
from src.services import ContactService
from src.types import (
    BaseApiResponse,
    ContactMessagePatch,
    ContactMessageResponse,
    MessageData,
    Page,
    UnreadCountResponse,
)

router = APIRouter(prefix="/messages", tags=["Quản trị · Hộp thư"], dependencies=[require_admin])


@router.get("", response_model=BaseApiResponse[Page[ContactMessageResponse]])
async def list_messages(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),
    unread_only: bool = Query(False),
):
    """List contact messages, newest first."""
    data = await ContactService().list_messages(
        page=page, page_size=page_size, unread_only=unread_only
    )
    return BaseApiResponse(detail="Danh sách tin nhắn", data=data)


@router.get("/unread-count", response_model=BaseApiResponse[UnreadCountResponse])
async def unread_count():
    """Count unread messages."""
    count = await ContactService().count_unread()
    return BaseApiResponse(detail="Số tin chưa đọc", data=UnreadCountResponse(count=count))


@router.patch("/{message_id}", response_model=BaseApiResponse[ContactMessageResponse])
async def mark_message(message_id: str, payload: ContactMessagePatch):
    """Mark a message read or unread."""
    data = await ContactService().mark_read(message_id, payload.is_read)
    return BaseApiResponse(detail="Đã cập nhật tin nhắn", data=data)


@router.delete("/{message_id}", response_model=BaseApiResponse[MessageData])
async def delete_message(message_id: str):
    """Delete a message."""
    await ContactService().delete(message_id)
    return BaseApiResponse(detail="Đã xoá tin nhắn", data=MessageData(message="Đã xoá tin nhắn"))

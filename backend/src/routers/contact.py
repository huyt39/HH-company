"""Contact form — public."""

from fastapi import APIRouter, status

from src.services import ContactService
from src.types import BaseApiResponse, ContactMessageRequest, MessageData

router = APIRouter(prefix="/contact", tags=["Liên hệ"])


@router.post(
    "",
    response_model=BaseApiResponse[MessageData],
    status_code=status.HTTP_201_CREATED,
)
async def submit_contact(payload: ContactMessageRequest):
    """Submit a contact message."""
    await ContactService().submit(payload)
    return BaseApiResponse(
        detail="Đã tiếp nhận thông tin liên hệ.",
        data=MessageData(message="Đã tiếp nhận thông tin liên hệ."),
    )

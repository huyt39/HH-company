from fastapi import APIRouter, status

from app.models import ContactMessage
from app.schemas.content import ContactMessageIn, ContactMessageOut

router = APIRouter()


@router.post(
    "",
    response_model=ContactMessageOut,
    status_code=status.HTTP_201_CREATED,
    summary="Gửi liên hệ",
)
async def submit_contact(payload: ContactMessageIn):
    await ContactMessage(**payload.model_dump()).insert()
    return ContactMessageOut()

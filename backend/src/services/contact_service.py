"""Contact form intake and the admin inbox."""

from fastapi import HTTPException, status

from src.models import ContactMessage
from src.repositories import ContactMessageRepository
from src.types import ContactMessageRequest, ContactMessageResponse, Page
from src.utils import Logger

logger = Logger("contact_service")


class ContactService:
    def __init__(self, messages: ContactMessageRepository | None = None) -> None:
        self.messages = messages or ContactMessageRepository()

    @staticmethod
    def _to_response(doc: ContactMessage) -> ContactMessageResponse:
        return ContactMessageResponse.model_validate({**doc.model_dump(), "id": str(doc.id)})

    async def submit(self, payload: ContactMessageRequest) -> None:
        await self.messages.create(payload.model_dump())
        logger.info(f"New contact message from {payload.email}")

    async def list_messages(
        self, *, page: int, page_size: int, unread_only: bool = False
    ) -> Page[ContactMessageResponse]:
        rows, total = await self.messages.paginate(
            {"is_read": False} if unread_only else None, page=page, page_size=page_size
        )
        total_pages = (total + page_size - 1) // page_size if page_size else 0
        return Page(
            items=[self._to_response(r) for r in rows],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    async def count_unread(self) -> int:
        return await self.messages.count_unread()

    async def _get_or_404(self, message_id: str) -> ContactMessage:
        doc = await self.messages.get(message_id)
        if doc is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy tin nhắn"
            )
        return doc

    async def mark_read(self, message_id: str, is_read: bool) -> ContactMessageResponse:
        doc = await self._get_or_404(message_id)
        await self.messages.update(doc, {"is_read": is_read})
        return self._to_response(doc)

    async def delete(self, message_id: str) -> None:
        doc = await self._get_or_404(message_id)
        await self.messages.delete(doc)

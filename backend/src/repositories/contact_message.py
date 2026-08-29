from src.models import ContactMessage
from src.repositories.base import BaseRepository


class ContactMessageRepository(BaseRepository[ContactMessage]):
    model = ContactMessage
    default_sort = (("created_at", -1), ("_id", -1))

    async def count_unread(self) -> int:
        return await self.count({"is_read": False})

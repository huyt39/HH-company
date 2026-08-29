from src.models import User
from src.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User
    default_sort = (("_id", 1),)

    async def get_by_email(self, email: str) -> User | None:
        return await self.find_one({"email": email})

    async def has_any(self) -> bool:
        return await self.find_one() is not None

    async def list_all(self) -> list[User]:
        return await self.find_many()

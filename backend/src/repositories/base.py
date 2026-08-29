"""Base repository — every MongoDB query goes through this layer.

Routers and services never touch Beanie directly, so changing how data is
queried (indexes, filters, caching) stays confined here.
"""

import re
from typing import Any, Generic, TypeVar

from beanie import PydanticObjectId

from src.models.base import BaseDocument

DocT = TypeVar("DocT", bound=BaseDocument)

# Sort order: tuples of (field, direction) with 1 = ascending, -1 = descending.
SortSpec = tuple[tuple[str, int], ...]


class BaseRepository(Generic[DocT]):
    """Shared CRUD and pagination for a collection."""

    model: type[DocT]
    default_sort: SortSpec = (("_id", 1),)
    # Fields the admin keyword search looks at.
    searchable: tuple[str, ...] = ()

    # ---- Read -------------------------------------------------------------- #

    async def get(self, doc_id: str) -> DocT | None:
        """Fetch by ObjectId. A malformed id counts as not found."""
        try:
            oid = PydanticObjectId(doc_id)
        except Exception:
            return None
        return await self.model.get(oid)

    async def find_one(self, filters: dict[str, Any] | None = None) -> DocT | None:
        return await self.model.find_one(filters or {})

    async def find_many(
        self,
        filters: dict[str, Any] | None = None,
        *,
        sort: SortSpec | None = None,
        skip: int = 0,
        limit: int = 0,
    ) -> list[DocT]:
        query = self.model.find(filters or {})
        query = query.sort(list(sort if sort is not None else self.default_sort))
        if skip:
            query = query.skip(skip)
        if limit:
            query = query.limit(limit)
        return await query.to_list()

    async def count(self, filters: dict[str, Any] | None = None) -> int:
        return await self.model.find(filters or {}).count()

    async def exists(self, filters: dict[str, Any]) -> bool:
        return await self.model.find_one(filters) is not None

    async def paginate(
        self,
        filters: dict[str, Any] | None = None,
        *,
        page: int = 1,
        page_size: int = 20,
        sort: SortSpec | None = None,
    ) -> tuple[list[DocT], int]:
        """Return (rows on the current page, total row count)."""
        filters = filters or {}
        total = await self.count(filters)
        rows = await self.find_many(
            filters,
            sort=sort,
            skip=(page - 1) * page_size,
            limit=page_size,
        )
        return rows, total

    # ---- Write ------------------------------------------------------------- #

    async def create(self, data: dict[str, Any]) -> DocT:
        doc = self.model(**data)
        await doc.insert()
        return doc

    async def update(self, doc: DocT, data: dict[str, Any]) -> DocT:
        for key, value in data.items():
            setattr(doc, key, value)
        await doc.save()
        return doc

    async def delete(self, doc: DocT) -> None:
        await doc.delete()

    # ---- Helpers ----------------------------------------------------------- #

    def search_filter(self, keyword: str | None) -> dict[str, Any]:
        """Case-insensitive `$or` filter across the `searchable` fields."""
        if not keyword or not self.searchable:
            return {}
        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
        return {"$or": [{field: {"$regex": pattern}} for field in self.searchable]}


class PublishableRepository(BaseRepository[DocT]):
    """Shortcuts for collections that have `is_published` and `slug`."""

    PUBLISHED: dict[str, Any] = {"is_published": True}

    async def list_published(
        self,
        extra: dict[str, Any] | None = None,
        *,
        sort: SortSpec | None = None,
    ) -> list[DocT]:
        return await self.find_many({**self.PUBLISHED, **(extra or {})}, sort=sort)

    async def paginate_published(
        self,
        extra: dict[str, Any] | None = None,
        *,
        page: int = 1,
        page_size: int = 10,
        sort: SortSpec | None = None,
    ) -> tuple[list[DocT], int]:
        return await self.paginate(
            {**self.PUBLISHED, **(extra or {})},
            page=page,
            page_size=page_size,
            sort=sort,
        )

    async def get_published_by_slug(self, slug: str) -> DocT | None:
        return await self.find_one({**self.PUBLISHED, "slug": slug})

    async def slug_taken(self, slug: str, *, exclude_id: PydanticObjectId | None = None) -> bool:
        existing = await self.find_one({"slug": slug})
        if existing is None:
            return False
        return exclude_id is None or existing.id != exclude_id

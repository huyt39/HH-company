from beanie import Indexed

from src.models.base import BaseDocument


class FinancialYear(BaseDocument):
    """One year of financial figures. `year` is the logical key; `_id` stays an ObjectId."""

    year: Indexed(int, unique=True)  # type: ignore[valid-type]
    revenue: int = 0
    profit_after_tax: int = 0
    total_assets: int = 0
    equity: int = 0
    is_published: bool = True

    class Settings:
        name = "financials"

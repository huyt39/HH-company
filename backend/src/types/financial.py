"""Yearly financial figures."""

from pydantic import BaseModel, Field

from src.types.common import AuditedResponse, make_optional


class FinancialYearResponse(BaseModel):
    year: int
    revenue: int = Field(description="Doanh thu thuần (VNĐ)")
    profit_after_tax: int = Field(description="Lợi nhuận sau thuế (VNĐ)")
    total_assets: int = Field(description="Tổng tài sản (VNĐ)")
    equity: int = Field(description="Vốn chủ sở hữu (VNĐ)")


class FinancialBase(BaseModel):
    year: int = Field(ge=1900, le=2200)
    revenue: int = Field(default=0, ge=0)
    profit_after_tax: int = 0
    total_assets: int = Field(default=0, ge=0)
    equity: int = 0
    is_published: bool = True


class FinancialAdminResponse(FinancialBase, AuditedResponse):
    pass


FinancialCreate = FinancialBase
FinancialUpdate = make_optional("FinancialUpdate", FinancialBase)

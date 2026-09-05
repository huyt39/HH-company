"""Contractor capability — public.

Backs the `/nang-luc` page: legal standing, the plant list and the document
library a main contractor asks for before awarding specialist bridge work.
"""

from fastapi import APIRouter, Query

from src.services import ContentService
from src.types import (
    BaseApiResponse,
    CertificateResponse,
    DocumentResponse,
    EquipmentResponse,
)

router = APIRouter(prefix="/capability", tags=["Năng lực"])


@router.get("/certificates", response_model=BaseApiResponse[list[CertificateResponse]])
async def list_certificates(
    category: str | None = Query(None, description="legal | iso | acceptance | product"),
):
    """Licences, management-system certificates and client acceptance letters."""
    return BaseApiResponse(
        detail="Chứng chỉ và hồ sơ pháp lý",
        data=await ContentService().list_certificates(category),
    )


@router.get("/equipment", response_model=BaseApiResponse[list[EquipmentResponse]])
async def list_equipment():
    """Construction equipment the company owns and mobilises to site."""
    return BaseApiResponse(detail="Thiết bị thi công", data=await ContentService().list_equipment())


@router.get("/documents", response_model=BaseApiResponse[list[DocumentResponse]])
async def list_documents():
    """Downloadable documents: capability profile, catalogues, method statements."""
    return BaseApiResponse(detail="Tài liệu tải về", data=await ContentService().list_documents())

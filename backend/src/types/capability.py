"""Contractor capability records: certificates, equipment and downloads.

These three back the `/nang-luc` page — the legal standing, the plant list and
the document library a main contractor or supervision consultant asks for
before awarding specialist bridge work.
"""

from pydantic import BaseModel, Field

from src.types.common import AuditedResponse, Media, PublishFields, make_optional

# --------------------------------------------------------------------------- #
# Certificates and licences
# --------------------------------------------------------------------------- #


class CertificateResponse(BaseModel):
    id: str
    name: str
    category: str | None = Field(default=None, description="legal | iso | acceptance | product")
    issuer: str | None = None
    code: str | None = None
    issued: str | None = None
    note: str | None = None
    image: Media | None = None


class CertificateBase(PublishFields):
    name: str = Field(min_length=1, max_length=400)
    category: str | None = Field(default=None, description="legal | iso | acceptance | product")
    issuer: str | None = Field(default=None, max_length=300)
    code: str | None = Field(default=None, max_length=120)
    issued: str | None = Field(default=None, max_length=120)
    note: str | None = None
    image: dict | None = None


class CertificateAdminResponse(CertificateBase, AuditedResponse):
    pass


CertificateCreate = CertificateBase
CertificateUpdate = make_optional("CertificateUpdate", CertificateBase)


# --------------------------------------------------------------------------- #
# Construction equipment
# --------------------------------------------------------------------------- #


class EquipmentResponse(BaseModel):
    id: str
    name: str
    category: str | None = Field(default=None, description="cang-keo | nang-ha | do-kiem | khac")
    spec: str | None = None
    note: str | None = None
    image: Media | None = None


class EquipmentBase(PublishFields):
    name: str = Field(min_length=1, max_length=300)
    category: str | None = Field(default=None, description="cang-keo | nang-ha | do-kiem | khac")
    spec: str | None = None
    note: str | None = None
    image: dict | None = None


class EquipmentAdminResponse(EquipmentBase, AuditedResponse):
    pass


EquipmentCreate = EquipmentBase
EquipmentUpdate = make_optional("EquipmentUpdate", EquipmentBase)


# --------------------------------------------------------------------------- #
# Downloadable documents
# --------------------------------------------------------------------------- #


class DocumentResponse(BaseModel):
    id: str
    title: str
    category: str | None = Field(
        default=None, description="profile | catalogue | method | certificate"
    )
    description: str | None = None
    file_url: str | None = None
    language: str | None = None
    size_label: str | None = None
    cover: Media | None = None


class DocumentBase(PublishFields):
    title: str = Field(min_length=1, max_length=400)
    category: str | None = Field(
        default=None, description="profile | catalogue | method | certificate"
    )
    description: str | None = None
    file_url: str | None = Field(default=None, max_length=1000)
    language: str | None = Field(default=None, max_length=20)
    size_label: str | None = Field(default=None, max_length=40)
    cover: dict | None = None


class DocumentAdminResponse(DocumentBase, AuditedResponse):
    pass


DocumentCreate = DocumentBase
DocumentUpdate = make_optional("DocumentUpdate", DocumentBase)

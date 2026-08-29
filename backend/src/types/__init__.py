"""API request/response types.

Database schemas live in `src.models`. Never expose database-only fields
(for example `password_hash`) here.
"""

from src.types.auth import PasswordChangeRequest, TokenResponse, UserResponse
from src.types.business_field import (
    BusinessFieldAdminResponse,
    BusinessFieldCreate,
    BusinessFieldResponse,
    BusinessFieldUpdate,
)
from src.types.career import JobAdminResponse, JobCreate, JobResponse, JobUpdate
from src.types.common import (
    AuditedResponse,
    BaseApiResponse,
    Media,
    MessageData,
    Page,
    PublishFields,
    ReorderRequest,
    Timestamped,
    make_optional,
)
from src.types.company import (
    CompanyMilestone,
    CompanyProfile,
    ContactInfo,
    Leader,
    OrgUnit,
)
from src.types.contact import (
    ContactMessagePatch,
    ContactMessageRequest,
    ContactMessageResponse,
    UnreadCountResponse,
)
from src.types.financial import (
    FinancialAdminResponse,
    FinancialCreate,
    FinancialUpdate,
    FinancialYearResponse,
)
from src.types.news import (
    Category,
    NewsAdminResponse,
    NewsCreate,
    NewsResponse,
    NewsUpdate,
)
from src.types.partner import (
    PartnerAdminResponse,
    PartnerCreate,
    PartnerResponse,
    PartnerUpdate,
)
from src.types.product import (
    ProductAdminResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from src.types.project import (
    ProjectAdminResponse,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from src.types.upload import StoredFile, UploadResponse

__all__ = [
    # common
    "AuditedResponse",
    "BaseApiResponse",
    "Media",
    "MessageData",
    "Page",
    "PublishFields",
    "ReorderRequest",
    "Timestamped",
    "make_optional",
    # auth
    "TokenResponse",
    "UserResponse",
    "PasswordChangeRequest",
    # company
    "CompanyProfile",
    "ContactInfo",
    "Leader",
    "OrgUnit",
    "CompanyMilestone",
    # business field
    "BusinessFieldResponse",
    "BusinessFieldAdminResponse",
    "BusinessFieldCreate",
    "BusinessFieldUpdate",
    # product
    "ProductResponse",
    "ProductAdminResponse",
    "ProductCreate",
    "ProductUpdate",
    # project
    "ProjectResponse",
    "ProjectAdminResponse",
    "ProjectCreate",
    "ProjectUpdate",
    # news
    "Category",
    "NewsResponse",
    "NewsAdminResponse",
    "NewsCreate",
    "NewsUpdate",
    # career
    "JobResponse",
    "JobAdminResponse",
    "JobCreate",
    "JobUpdate",
    # financial
    "FinancialYearResponse",
    "FinancialAdminResponse",
    "FinancialCreate",
    "FinancialUpdate",
    # partner
    "PartnerResponse",
    "PartnerAdminResponse",
    "PartnerCreate",
    "PartnerUpdate",
    # contact
    "ContactMessageRequest",
    "ContactMessageResponse",
    "ContactMessagePatch",
    "UnreadCountResponse",
    # upload
    "UploadResponse",
    "StoredFile",
]

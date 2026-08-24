from fastapi import APIRouter

from app.api.v1.admin.router import admin_router
from app.api.v1.endpoints import auth, careers, company, contact, fields, news, products, projects

api_router = APIRouter()

# ---- Public ----
api_router.include_router(company.router, prefix="/company", tags=["company"])
api_router.include_router(fields.router, prefix="/fields", tags=["fields"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(careers.router, prefix="/careers", tags=["careers"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])

# ---- Quản trị (yêu cầu đăng nhập) ----
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin_router, prefix="/admin")

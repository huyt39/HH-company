"""Aggregates every API router into one `main_router`.

The version prefix (`/api/v1`) is applied in `src/main.py`, so each router
below only declares its own path segment.
"""

from fastapi import APIRouter

from src.routers import (
    auth,
    capability,
    careers,
    company,
    contact,
    fields,
    news,
    products,
    projects,
)
from src.routers.admin import admin_router

main_router = APIRouter()

# ---- Public ---- #
main_router.include_router(company.router)
main_router.include_router(capability.router)
main_router.include_router(fields.router)
main_router.include_router(products.router)
main_router.include_router(projects.router)
main_router.include_router(news.router)
main_router.include_router(careers.router)
main_router.include_router(contact.router)

# ---- Admin (login required) ---- #
main_router.include_router(auth.router)
main_router.include_router(admin_router)

__all__ = ["main_router"]

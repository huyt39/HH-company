"""FastAPI dependencies."""

from src.dependencies.auth import get_current_user, oauth2_scheme, require_admin

__all__ = ["get_current_user", "require_admin", "oauth2_scheme"]

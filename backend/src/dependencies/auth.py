"""Authentication dependency for admin endpoints."""

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from src.configs import app_config
from src.models import User
from src.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{app_config.API_V1_PREFIX}/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Resolve the Bearer token to the signed-in user; 401 when invalid."""
    return await AuthService().resolve_token(token)


# Put in a router's `dependencies=[...]` to require login for every endpoint
# inside it without adding a parameter to each handler.
require_admin = Depends(get_current_user)

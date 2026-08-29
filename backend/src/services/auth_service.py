"""Login and admin account business logic."""

from fastapi import HTTPException, status

from src.models import User
from src.repositories import UserRepository
from src.services.jwt_service import jwt_service
from src.services.password_service import hash_password, verify_password
from src.utils import Logger

logger = Logger("auth_service")

INVALID_CREDENTIALS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Email hoặc mật khẩu không đúng",
    headers={"WWW-Authenticate": "Bearer"},
)

INVALID_SESSION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
    headers={"WWW-Authenticate": "Bearer"},
)


class AuthService:
    def __init__(self, users: UserRepository | None = None) -> None:
        self.users = users or UserRepository()

    async def authenticate(self, email: str, password: str) -> str:
        """Verify credentials and return an access token."""
        user = await self.users.get_by_email(email)
        if user is None or not verify_password(password, user.password_hash):
            raise INVALID_CREDENTIALS
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Tài khoản đã bị khoá"
            )
        return jwt_service.create_access_token(user.email)

    async def resolve_token(self, token: str) -> User:
        """Resolve an access token to an active user."""
        email = jwt_service.get_subject(token)
        if email is None:
            raise INVALID_SESSION

        user = await self.users.get_by_email(email)
        if user is None or not user.is_active:
            raise INVALID_SESSION
        return user

    async def change_password(self, user: User, current: str, new: str) -> None:
        if not verify_password(current, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu hiện tại không đúng"
            )
        await self.users.update(user, {"password_hash": hash_password(new)})
        logger.info(f"Password changed for {user.email}")

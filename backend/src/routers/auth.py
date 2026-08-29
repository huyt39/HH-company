"""Login and admin account."""

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from src.dependencies import get_current_user
from src.models import User
from src.services import AuthService
from src.types import (
    BaseApiResponse,
    MessageData,
    PasswordChangeRequest,
    TokenResponse,
    UserResponse,
)
from src.utils import Logger

logger = Logger("auth_router")

router = APIRouter(prefix="/auth", tags=["Xác thực"])


@router.post("/login", response_model=BaseApiResponse[TokenResponse])
async def login(form: OAuth2PasswordRequestForm = Depends()):
    """Admin login. `OAuth2PasswordRequestForm` names the field `username`; pass the email."""
    token = await AuthService().authenticate(form.username, form.password)
    logger.info(f"Login succeeded: {form.username}")
    return BaseApiResponse(detail="Đăng nhập thành công", data=TokenResponse(access_token=token))


@router.get("/me", response_model=BaseApiResponse[UserResponse])
async def me(user: User = Depends(get_current_user)):
    """Current signed-in account."""
    return BaseApiResponse(
        detail="Thông tin tài khoản",
        data=UserResponse(id=str(user.id), email=user.email, full_name=user.full_name),
    )


@router.post("/change-password", response_model=BaseApiResponse[MessageData])
async def change_password(
    payload: PasswordChangeRequest,
    user: User = Depends(get_current_user),
):
    """Change the signed-in account's own password."""
    await AuthService().change_password(user, payload.current_password, payload.new_password)
    return BaseApiResponse(detail="Đã đổi mật khẩu.", data=MessageData(message="Đã đổi mật khẩu."))

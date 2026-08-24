from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.models import User

router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str | None = None

    model_config = {"from_attributes": True}


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


@router.post("/login", response_model=Token, summary="Đăng nhập quản trị")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm gọi trường là `username`, ở đây ta dùng email.
    user = await User.find_one(User.email == form.username)
    if user is None or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tài khoản đã bị khoá")

    return Token(access_token=create_access_token(user.email))


@router.get("/me", response_model=UserOut, summary="Thông tin tài khoản đang đăng nhập")
async def me(user: User = Depends(get_current_user)):
    return UserOut(id=str(user.id), email=user.email, full_name=user.full_name)


@router.post("/change-password", summary="Đổi mật khẩu")
async def change_password(
    payload: PasswordChange,
    user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không đúng")

    user.password_hash = hash_password(payload.new_password)
    await user.save()
    return {"success": True, "message": "Đã đổi mật khẩu."}

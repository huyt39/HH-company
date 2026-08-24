"""Lệnh quản lý tài khoản quản trị.

    python -m app.db.manage list
    python -m app.db.manage reset-password <email> [mật-khẩu-mới]
    python -m app.db.manage create-user <email> [mật-khẩu]

Bỏ trống mật khẩu thì hệ thống tự sinh chuỗi ngẫu nhiên và in ra một lần.
"""

import asyncio
import sys

import beanie
import motor.motor_asyncio

from app.core.config import settings
from app.core.security import generate_password, hash_password
from app.models import User


async def _init():
    """Khởi tạo Beanie trước khi chạy bất kỳ lệnh nào."""
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    await beanie.init_beanie(database=db, document_models=[User])


def _print_credentials(email: str, password: str, generated: bool) -> None:
    print("=" * 64)
    print(f"  Email:    {email}")
    print(f"  Mật khẩu: {password}")
    if generated:
        print("  (mật khẩu tự sinh — lưu lại ngay, không hiển thị lại)")
    print("=" * 64)


async def cmd_list() -> None:
    users = await User.find_all().to_list()
    if not users:
        print("Chưa có tài khoản nào.")
        return
    for u in users:
        state = "hoạt động" if u.is_active else "đã khoá"
        uid = str(u.id)[:8]
        print(f"  #{uid}  {u.email:<32} {u.full_name or '—':<20} {state}")


async def cmd_reset_password(email: str, password: str | None) -> int:
    user = await User.find_one(User.email == email)
    if user is None:
        print(f"Không tìm thấy tài khoản: {email}", file=sys.stderr)
        return 1
    generated = password is None
    password = password or generate_password()
    user.password_hash = hash_password(password)
    await user.save()
    print("Đã đặt lại mật khẩu.")
    _print_credentials(email, password, generated)
    return 0


async def cmd_create_user(email: str, password: str | None) -> int:
    if await User.find_one(User.email == email) is not None:
        print(f"Tài khoản đã tồn tại: {email}", file=sys.stderr)
        return 1
    generated = password is None
    password = password or generate_password()
    await User(
        email=email,
        full_name="Quản trị viên",
        password_hash=hash_password(password),
    ).insert()
    print("Đã tạo tài khoản.")
    _print_credentials(email, password, generated)
    return 0


async def main_async(argv: list[str]) -> int:
    if not argv:
        print(__doc__)
        return 1

    await _init()

    command, *args = argv
    if command == "list":
        await cmd_list()
        return 0
    if command in {"reset-password", "create-user"}:
        if not args:
            print(f"Thiếu email. Dùng: python -m app.db.manage {command} <email> [mật-khẩu]", file=sys.stderr)
            return 1
        email, password = args[0], (args[1] if len(args) > 1 else None)
        return await (cmd_reset_password(email, password) if command == "reset-password" else cmd_create_user(email, password))

    print(f"Lệnh không hợp lệ: {command}\n{__doc__}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

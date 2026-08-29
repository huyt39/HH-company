"""Admin account management CLI.

    python -m scripts.manage_users list
    python -m scripts.manage_users reset-password <email> [new-password]
    python -m scripts.manage_users create-user <email> [password]

Omit the password and a random one is generated and printed once.
"""

import asyncio
import sys

from src.repositories import UserRepository
from src.services import MongoDatabase
from src.services.password_service import generate_password, hash_password

BORDER = "=" * 64


def _print_credentials(email: str, password: str, generated: bool) -> None:
    print(BORDER)
    print(f"  Email:    {email}")
    print(f"  Mật khẩu: {password}")
    if generated:
        print("  (mật khẩu tự sinh — lưu lại ngay, không hiển thị lại)")
    print(BORDER)


async def cmd_list(users: UserRepository) -> int:
    rows = await users.list_all()
    if not rows:
        print("Chưa có tài khoản nào.")
        return 0
    for user in rows:
        state = "hoạt động" if user.is_active else "đã khoá"
        print(f"  #{str(user.id)[:8]}  {user.email:<32} {user.full_name or '—':<20} {state}")
    return 0


async def cmd_reset_password(users: UserRepository, email: str, password: str | None) -> int:
    user = await users.get_by_email(email)
    if user is None:
        print(f"Không tìm thấy tài khoản: {email}", file=sys.stderr)
        return 1

    generated = password is None
    password = password or generate_password()
    await users.update(user, {"password_hash": hash_password(password)})
    print("Đã đặt lại mật khẩu.")
    _print_credentials(email, password, generated)
    return 0


async def cmd_create_user(users: UserRepository, email: str, password: str | None) -> int:
    if await users.get_by_email(email) is not None:
        print(f"Tài khoản đã tồn tại: {email}", file=sys.stderr)
        return 1

    generated = password is None
    password = password or generate_password()
    await users.create(
        {
            "email": email,
            "full_name": "Quản trị viên",
            "password_hash": hash_password(password),
        }
    )
    print("Đã tạo tài khoản.")
    _print_credentials(email, password, generated)
    return 0


async def main_async(argv: list[str]) -> int:
    if not argv:
        print(__doc__)
        return 1

    command, *args = argv
    if command not in {"list", "reset-password", "create-user"}:
        print(f"Lệnh không hợp lệ: {command}\n{__doc__}", file=sys.stderr)
        return 1
    if command != "list" and not args:
        print(f"Thiếu email. Dùng: python -m scripts.manage_users {command} <email> [mật-khẩu]", file=sys.stderr)
        return 1

    database = MongoDatabase()
    await database.connect()
    users = UserRepository()
    try:
        if command == "list":
            return await cmd_list(users)
        # An empty string counts as omitted, so it falls through to generation.
        email = args[0]
        password = args[1] if len(args) > 1 and args[1] else None
        if command == "reset-password":
            return await cmd_reset_password(users, email, password)
        return await cmd_create_user(users, email, password)
    finally:
        await database.close()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main_async(sys.argv[1:])))

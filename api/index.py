"""Entry point cho Vercel Serverless Python Runtime.

Vercel yêu cầu file này nằm ở thư mục `api/` và export biến `app`.
Toàn bộ logic nằm trong `backend/app/`, file này chỉ re-export.
"""

import sys
from pathlib import Path

# Thêm thư mục backend vào sys.path để import được app.*
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from app.main import app  # noqa: F401, E402 — Vercel cần biến `app`

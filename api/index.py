"""Vercel serverless entry point.

Vercel requires the handler to live under `api/` and export a module-level
`app`. All source lives in `backend/src/`; this file only wires the path.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from src.main import app  # noqa: E402, F401 — Vercel needs `app` at module level

"""Shared logger: coloured console output plus a daily log file.

The file handler is skipped when the filesystem is read-only (serverless), so
importing this module never crashes the process.
"""

import logging
import os
from datetime import datetime
from pathlib import Path

_LOG_DIR = Path(os.getenv("LOG_DIR", "logs"))


def _file_handler() -> logging.Handler | None:
    """Daily log file handler, or None when the directory is not writable."""
    try:
        _LOG_DIR.mkdir(parents=True, exist_ok=True)
        handler = logging.FileHandler(_LOG_DIR / f"{datetime.now():%Y-%m-%d}.log")
    except OSError:
        return None
    handler.setLevel(logging.INFO)
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s - %(levelname)s - %(message)s - %(name)s - %(filename)s:%(lineno)d"
        )
    )
    return handler


class _ColoredFormatter(logging.Formatter):
    COLORS = {
        "DEBUG": "\033[36m",
        "INFO": "\033[32m",
        "WARNING": "\033[33m",
        "ERROR": "\033[31m",
        "CRITICAL": "\033[35m",
    }
    RESET = "\033[0m"

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelname)
        if color:
            # Colour a copy so other handlers keep the plain level name.
            record = logging.makeLogRecord(record.__dict__)
            record.levelname = f"{color}{record.levelname}{self.RESET}"
        return super().format(record)


class Logger:
    """One instance per name: `Logger("auth_router")`."""

    _instances: dict[str, "Logger"] = {}

    def __new__(cls, name: str = "app") -> "Logger":
        if name not in cls._instances:
            instance = super().__new__(cls)
            instance._setup(name)
            cls._instances[name] = instance
        return cls._instances[name]

    def _setup(self, name: str) -> None:
        self._logger = logging.getLogger(name)
        self._logger.setLevel(logging.INFO)
        self._logger.handlers.clear()
        self._logger.propagate = False

        stream = logging.StreamHandler()
        stream.setLevel(logging.INFO)
        stream.setFormatter(_ColoredFormatter("%(levelname)s: [%(name)s] %(message)s"))
        self._logger.addHandler(stream)

        handler = _file_handler()
        if handler is not None:
            self._logger.addHandler(handler)

    def _log(self, method, msg: str, **kwargs) -> None:
        try:
            kwargs.setdefault("stacklevel", 3)
            method(msg, **kwargs)
        except Exception:  # logging must never break a request
            pass

    def debug(self, msg: str, extra: dict | None = None) -> None:
        self._log(self._logger.debug, msg, extra=extra)

    def info(self, msg: str, extra: dict | None = None) -> None:
        self._log(self._logger.info, msg, extra=extra)

    def warning(self, msg: str, extra: dict | None = None) -> None:
        self._log(self._logger.warning, msg, extra=extra)

    def error(self, msg: str, exc_info: bool = False, extra: dict | None = None) -> None:
        self._log(self._logger.error, msg, exc_info=exc_info, extra=extra)

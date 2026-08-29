"""String helpers."""

import re
import unicodedata

_NON_ALNUM = re.compile(r"[^a-z0-9]+")


def slugify(value: str) -> str:
    """Strip Vietnamese diacritics, then reduce to a-z, 0-9 and hyphens."""
    value = value.replace("đ", "d").replace("Đ", "D")
    stripped = "".join(
        char for char in unicodedata.normalize("NFD", value) if not unicodedata.combining(char)
    )
    return _NON_ALNUM.sub("-", stripped.lower()).strip("-")

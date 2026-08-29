"""Password hashing with PBKDF2-HMAC-SHA256.

Uses stdlib hashlib to avoid a compiled bcrypt dependency, which matters
for serverless builds.
"""

import hashlib
import hmac
import secrets

ITERATIONS = 260_000
ALGORITHM = "pbkdf2_sha256"


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), ITERATIONS).hex()
    return f"{ALGORITHM}${ITERATIONS}${salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, iterations, salt, digest = stored.split("$")
        if algorithm != ALGORITHM:
            return False
        expected = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), salt.encode(), int(iterations)
        ).hex()
    except (ValueError, AttributeError):
        return False
    # Constant-time compare to avoid timing attacks.
    return hmac.compare_digest(expected, digest)


def generate_password(length: int = 16) -> str:
    return secrets.token_urlsafe(length)

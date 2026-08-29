"""Issue and verify JWTs."""

from datetime import datetime, timedelta, timezone

import jwt

from src.configs import SecurityConfig, security_config


class JWTService:
    def __init__(self, config: SecurityConfig | None = None) -> None:
        self.config = config or security_config

    def create_access_token(self, subject: str) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "sub": subject,
            "iat": now,
            "exp": now + timedelta(minutes=self.config.ACCESS_TOKEN_EXPIRE_MINUTES),
        }
        return jwt.encode(payload, self.config.SECRET_KEY, algorithm=self.config.ALGORITHM)

    def get_subject(self, token: str) -> str | None:
        """Return the token's `sub`, or None when the signature is bad or expired."""
        try:
            payload = jwt.decode(
                token, self.config.SECRET_KEY, algorithms=[self.config.ALGORITHM]
            )
        except jwt.PyJWTError:
            return None
        return payload.get("sub")


jwt_service = JWTService()

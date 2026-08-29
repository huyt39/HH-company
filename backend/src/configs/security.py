from src.configs.base import EnvConfig

# Sample value shipped in .env.example. The app refuses to boot in production
# while SECRET_KEY still holds it.
PLACEHOLDER_SECRET_KEY = "doi-chuoi-nay-truoc-khi-deploy"


class SecurityConfig(EnvConfig):
    """JWT signing key and the bootstrap admin account."""

    SECRET_KEY: str = PLACEHOLDER_SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    ADMIN_EMAIL: str = "admin@hoahoang.vn"
    # Left empty, the first seed generates a random password and logs it once.
    ADMIN_PASSWORD: str = ""

    @property
    def has_placeholder_secret(self) -> bool:
        return self.SECRET_KEY == PLACEHOLDER_SECRET_KEY

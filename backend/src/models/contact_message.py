from src.models.base import BaseDocument


class ContactMessage(BaseDocument):
    """A message submitted through the website contact form."""

    full_name: str
    email: str
    phone: str | None = None
    subject: str | None = None
    message: str
    is_read: bool = False

    class Settings:
        name = "contact_messages"

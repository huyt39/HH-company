"""Shared constants, kept here instead of scattered magic strings."""


class SETTING_KEY:
    """Keys of the singleton documents in the `settings` collection."""

    COMPANY_PROFILE = "company_profile"
    CONTACT_INFO = "contact_info"
    # Marks the database as seeded, so it only ever happens once.
    SEEDED = "_seeded"


class PROJECT_STATUS:
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class PARTNER_ROLE:
    CUSTOMER = "customer"
    MANUFACTURER = "manufacturer"

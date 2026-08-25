"""Data models shared by Billy parser, sources and import coordinator."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(slots=True)
class MailPart:
    """Metadata for one MIME part advertised by the IMAP integration."""

    part: str
    content_type: str = ""
    filename: str = ""
    content_transfer_encoding: str = ""

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class MailEnvelope:
    """Privacy-safe message metadata available before fetching message content."""

    entry_id: str
    uid: str
    sender: str = ""
    subject: str = ""
    date: str = ""
    folder: str = ""
    server: str = ""
    username: str = ""
    parts: list[MailPart] = field(default_factory=list)
    initial: bool = True

    def as_dict(self) -> dict[str, Any]:
        result = asdict(self)
        result["parts"] = [part.as_dict() for part in self.parts]
        return result


@dataclass(slots=True)
class DocumentBundle:
    """Normalized text documents made available to the declarative parser."""

    email: str = ""
    documents: dict[str, str] = field(default_factory=dict)

    def source(self, name: str) -> str:
        if name == "email":
            return self.email
        return self.documents.get(name, "")


@dataclass(slots=True)
class BillCandidate:
    """Parsed bill waiting for review or automatic import."""

    id: str
    parser_id: str
    parser_version: int
    category_id: str
    data: dict[str, Any]
    confidence: int
    matched_score: int
    matched_threshold: int
    verification: list[dict[str, Any]]
    source: dict[str, Any]
    fingerprint: str
    status: str = "pending"
    created_at: str = ""
    expense_id: str | None = None
    error: str = ""

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)

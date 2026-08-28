"""Privacy-first adapter around Home Assistant's IMAP integration."""
from __future__ import annotations

import asyncio
import base64
import binascii
from typing import Any

from homeassistant.core import HomeAssistant

from ..extractors.email import normalize_email_text
from ..parser.models import MailEnvelope, MailPart


class ImapSourceError(RuntimeError):
    """Raised when Home Assistant cannot fetch a selected IMAP message/part."""


class ImapSource:
    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    @staticmethod
    def envelope(event_data: dict[str, Any]) -> MailEnvelope:
        parts: list[MailPart] = []
        for part_id, metadata in (event_data.get("parts") or {}).items():
            if not isinstance(metadata, dict):
                continue
            parts.append(
                MailPart(
                    part=str(part_id),
                    content_type=str(metadata.get("content_type") or ""),
                    filename=str(metadata.get("filename") or ""),
                    content_transfer_encoding=str(metadata.get("content_transfer_encoding") or ""),
                )
            )
        date_value = event_data.get("date")
        return MailEnvelope(
            entry_id=str(event_data.get("entry_id") or ""),
            uid=str(event_data.get("uid") or ""),
            sender=str(event_data.get("sender") or ""),
            subject=str(event_data.get("subject") or ""),
            date=(date_value.isoformat() if hasattr(date_value, "isoformat") else str(date_value or "")),
            folder=str(event_data.get("folder") or ""),
            server=str(event_data.get("server") or ""),
            username=str(event_data.get("username") or ""),
            parts=parts,
            initial=bool(event_data.get("initial", True)),
        )

    async def async_fetch(self, envelope: MailEnvelope) -> dict[str, Any]:
        if not envelope.entry_id or not envelope.uid:
            raise ImapSourceError("IMAP event is missing entry_id or uid")
        response = None
        last_error = None
        for attempt in range(2):
            try:
                response = await self.hass.services.async_call(
                    "imap",
                    "fetch",
                    {"entry": envelope.entry_id, "uid": envelope.uid},
                    blocking=True,
                    return_response=True,
                )
                break
            except Exception as err:  # noqa: BLE001 - HA IMAP can fail transiently
                last_error = err
                if attempt == 0:
                    await asyncio.sleep(0.25)
        if response is None and last_error is not None:
            raise ImapSourceError("Unable to fetch IMAP message") from last_error
        if not isinstance(response, dict):
            raise ImapSourceError("IMAP fetch returned an invalid response")
        response = dict(response)
        response["text"] = normalize_email_text(str(response.get("text") or ""))
        return response

    async def async_fetch_part(self, envelope: MailEnvelope, part: MailPart) -> bytes:
        response = None
        last_error = None
        for attempt in range(2):
            try:
                response = await self.hass.services.async_call(
                    "imap",
                    "fetch_part",
                    {"entry": envelope.entry_id, "uid": envelope.uid, "part": part.part},
                    blocking=True,
                    return_response=True,
                )
                break
            except Exception as err:  # noqa: BLE001 - HA IMAP can fail transiently
                last_error = err
                if attempt == 0:
                    await asyncio.sleep(0.25)
        if response is None and last_error is not None:
            raise ImapSourceError(f"Unable to fetch IMAP part {part.part}") from last_error
        if not isinstance(response, dict):
            raise ImapSourceError("IMAP fetch_part returned an invalid response")
        data = response.get("part_data")
        if isinstance(data, bytes):
            return data
        if data is None:
            return b""
        text = str(data)
        encoding = str(response.get("content_transfer_encoding") or part.content_transfer_encoding).casefold()
        if encoding == "base64":
            try:
                return base64.b64decode(text, validate=False)
            except (ValueError, binascii.Error) as err:
                raise ImapSourceError("Invalid base64 attachment returned by IMAP") from err
        return text.encode("utf-8", errors="replace")

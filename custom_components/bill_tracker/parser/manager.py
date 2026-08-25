"""Parser catalog, installation and automatic IMAP processing coordinator."""
from __future__ import annotations

import hashlib
import logging
import re
from datetime import datetime
from typing import Any
from uuid import uuid4

import yaml
from homeassistant.core import Event, HomeAssistant, callback

from ..extractors import PdfExtractionError, extract_pdf_text
from ..importers import BillImportCoordinator
from ..sources import ImapSource
from .catalog import CatalogError, ParserCatalogClient
from .engine import ParserEngine, ParserError
from .models import BillCandidate, DocumentBundle, MailEnvelope, MailPart
from .storage import ParserStorage
from .validator import ParserValidationError, load_parser_yaml, validate_parser

_LOGGER = logging.getLogger(__name__)
EVENT_IMPORT_UPDATED = "bill_tracker_import_updated"
MAX_IMPORT_HISTORY = 500


class ParserManager:
    """Own parser state while BillTrackerManager remains the owner of expenses."""

    def __init__(self, hass: HomeAssistant, bill_manager, billy_version: str = "0.6.1") -> None:
        self.hass = hass
        self.bill_manager = bill_manager
        self.billy_version = billy_version
        self.storage = ParserStorage(hass)
        self.catalog_client = ParserCatalogClient(hass)
        self.engine = ParserEngine()
        self.imap = ImapSource(hass)
        self.importer = BillImportCoordinator(bill_manager)
        self.parsers: dict[str, dict[str, Any]] = {}
        self._unsubscribe = None

    async def async_load(self) -> None:
        await self.storage.async_load()
        await self._reload_installed()

    async def async_start(self) -> None:
        if self._unsubscribe is None:
            self._unsubscribe = self.hass.bus.async_listen("imap_content", self._handle_imap_event)

    async def async_stop(self) -> None:
        if self._unsubscribe is not None:
            self._unsubscribe()
            self._unsubscribe = None

    @callback
    def _handle_imap_event(self, event: Event) -> None:
        self.hass.async_create_task(self.async_process_imap_event(dict(event.data)))

    async def async_process_imap_event(self, event_data: dict[str, Any]) -> dict[str, Any] | None:
        envelope = self.imap.envelope(event_data)
        if not envelope.entry_id or not envelope.uid:
            return None
        enabled_entries = set(self.storage.data.get("source_entry_ids", []))
        if not enabled_entries or envelope.entry_id not in enabled_entries:
            return None

        prefiltered: list[tuple[str, dict[str, Any], dict[str, Any]]] = []
        for parser_id, parser in self.parsers.items():
            config = self.storage.data.get("installed", {}).get(parser_id) or self.storage.data.get("custom", {}).get(parser_id)
            if not config or not config.get("enabled", True):
                continue
            if self.engine.prefilter(parser, envelope):
                prefiltered.append((parser_id, parser, config))
        if not prefiltered:
            return None

        prefetch_key = self._prefetch_fingerprint(envelope)
        if self._has_source_fingerprint(prefetch_key):
            return None

        try:
            fetched = await self.imap.async_fetch(envelope)
            envelope = self._merge_fetched_envelope(envelope, fetched)
            email_text = str(fetched.get("text") or "")
            base_documents = DocumentBundle(email=email_text)

            matches: list[tuple[int, int, str, dict[str, Any], dict[str, Any]]] = []
            for parser_id, parser, config in prefiltered:
                matched, score, threshold = self.engine.detect(parser, envelope, base_documents)
                if matched:
                    matches.append((score, threshold, parser_id, parser, config))
            if not matches:
                return None
            matches.sort(key=lambda item: (item[0] / max(1, item[1]), item[0]), reverse=True)
            score, threshold, parser_id, parser, config = matches[0]
            documents, attachment_hashes = await self._documents_for(parser, envelope, email_text)
            matched, score, threshold = self.engine.detect(parser, envelope, documents)
            if not matched:
                return None
            parsed = self.engine.parse(parser, envelope, documents)
            verification = self.engine.verification(parser, documents)
            candidate = self._candidate(
                parser_id=parser_id,
                parser=parser,
                config=config,
                envelope=envelope,
                parsed=parsed,
                score=score,
                threshold=threshold,
                verification=verification,
                source_fingerprint=prefetch_key,
                attachment_hashes=attachment_hashes,
            )
            if self._is_duplicate_candidate(candidate):
                return None
            await self._record_candidate(candidate)
            expected_checks = len(parser.get("verification", []) or [])
            verification_complete = (
                expected_checks == 0
                or (
                    len(verification) == expected_checks
                    and all(item.get("match", False) for item in verification)
                )
            )
            if (
                config.get("auto_import", False)
                and verification_complete
                and candidate.confidence >= 90
            ):
                await self.async_approve(candidate.id)
            return self.get_import(candidate.id)
        except (ParserError, ParserValidationError, PdfExtractionError, ValueError, RuntimeError) as err:
            _LOGGER.warning("Billy automatic parsing failed for IMAP UID %s: %s", envelope.uid, err)
            await self._record_error(envelope, prefetch_key, str(err))
            return None
        except Exception as err:  # noqa: BLE001 - source events must never break HA
            _LOGGER.exception("Unexpected Billy parser error")
            await self._record_error(envelope, prefetch_key, f"Unexpected error: {err}")
            return None

    async def async_refresh_catalog(self) -> dict[str, Any]:
        catalog = await self.catalog_client.async_fetch_catalog()
        self.storage.data["catalog"] = {
            **catalog,
            "updated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        }
        await self.storage.async_save()
        return self.catalog_snapshot()

    def catalog_snapshot(self) -> dict[str, Any]:
        catalog = dict(self.storage.data.get("catalog") or {})
        installed = self.storage.data.get("installed", {})
        custom = self.storage.data.get("custom", {})
        rows = []
        for item in catalog.get("parsers", []) or []:
            row = dict(item)
            state = installed.get(str(item.get("id")))
            row["installed"] = bool(state)
            row["installed_version"] = int(state.get("version", 0)) if state else None
            row["update_available"] = bool(state and int(item.get("version", 0)) > int(state.get("version", 0)))
            row["enabled"] = bool(state.get("enabled", True)) if state else False
            row["category_id"] = state.get("category_id") if state else None
            row["auto_import"] = bool(state.get("auto_import", False)) if state else False
            rows.append(row)
        catalog["parsers"] = rows
        catalog["custom_count"] = len(custom)
        return catalog

    async def async_install(
        self,
        parser_id: str,
        *,
        category_id: str,
        enabled: bool = True,
        auto_import: bool = False,
    ) -> dict[str, Any]:
        self._ensure_category(category_id)
        if parser_id in self.storage.data.get("custom", {}):
            raise CatalogError(
                "A custom parser with this ID already exists; remove it before installing the official parser"
            )
        catalog = self.storage.data.get("catalog") or {}
        if not catalog.get("parsers"):
            await self.async_refresh_catalog()
            catalog = self.storage.data.get("catalog") or {}
        item = next((row for row in catalog.get("parsers", []) if row.get("id") == parser_id), None)
        if item is None:
            raise CatalogError("Parser not found in the remote catalog")
        if not self._version_supported(str(item.get("min_billy_version") or "0.0.0")):
            raise CatalogError("This parser requires a newer Billy version")
        parser, content = await self.catalog_client.async_fetch_parser(catalog, item)
        validate_parser(parser)
        path = await self.storage.async_write_official(parser_id, content)
        self.storage.data["installed"][parser_id] = {
            "id": parser_id,
            "version": int(parser["version"]),
            "sha256": str(item.get("sha256") or ""),
            "path": path,
            "enabled": bool(enabled),
            "category_id": category_id,
            "auto_import": bool(auto_import),
            "source": "official",
            "installed_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        }
        await self.storage.async_save()
        self.parsers[parser_id] = parser
        return dict(self.storage.data["installed"][parser_id])

    async def async_uninstall(self, parser_id: str) -> bool:
        state = self.storage.data.get("installed", {}).pop(parser_id, None)
        if state is None:
            return False
        if state.get("path"):
            await self.storage.async_delete_file(str(state["path"]))
        self.parsers.pop(parser_id, None)
        await self.storage.async_save()
        return True

    async def async_configure(
        self,
        parser_id: str,
        *,
        category_id: str,
        enabled: bool,
        auto_import: bool,
    ) -> dict[str, Any]:
        self._ensure_category(category_id)
        state = self.storage.data.get("installed", {}).get(parser_id)
        if state is None:
            state = self.storage.data.get("custom", {}).get(parser_id)
        if state is None:
            raise ValueError("Parser is not installed")
        state.update(
            {
                "category_id": category_id,
                "enabled": bool(enabled),
                "auto_import": bool(auto_import),
            }
        )
        await self.storage.async_save()
        return dict(state)

    async def async_save_custom(
        self,
        content: str,
        *,
        category_id: str,
        enabled: bool = True,
        auto_import: bool = False,
    ) -> dict[str, Any]:
        self._ensure_category(category_id)
        parser = load_parser_yaml(content)
        parser_id = str(parser["id"])
        if parser_id in self.storage.data.get("installed", {}):
            raise ValueError(
                "An official parser with this ID is installed; uninstall it before saving the custom parser"
            )
        path = await self.storage.async_write_custom(parser_id, content)
        self.storage.data["custom"][parser_id] = {
            "id": parser_id,
            "version": int(parser["version"]),
            "path": path,
            "enabled": bool(enabled),
            "category_id": category_id,
            "auto_import": bool(auto_import),
            "source": "custom",
            "saved_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        }
        await self.storage.async_save()
        self.parsers[parser_id] = parser
        return dict(self.storage.data["custom"][parser_id])

    async def async_delete_custom(self, parser_id: str) -> bool:
        state = self.storage.data.get("custom", {}).pop(parser_id, None)
        if state is None:
            return False
        if state.get("path"):
            await self.storage.async_delete_file(str(state["path"]))
        self.parsers.pop(parser_id, None)
        await self.storage.async_save()
        return True

    async def async_export_custom(self, parser_id: str) -> tuple[str, str]:
        state = self.storage.data.get("custom", {}).get(parser_id)
        if state is None:
            raise ValueError("Custom parser not found")
        _parser, content = await self.storage.async_load_parser_file(str(state["path"]))
        return f"{parser_id}.yaml", content

    async def async_set_sources(self, entry_ids: list[str]) -> list[str]:
        known = {entry.entry_id for entry in self.hass.config_entries.async_entries("imap")}
        selected = sorted({str(value) for value in entry_ids if str(value) in known})
        self.storage.data["source_entry_ids"] = selected
        await self.storage.async_save()
        return selected

    def sources_snapshot(self) -> list[dict[str, Any]]:
        selected = set(self.storage.data.get("source_entry_ids", []))
        return [
            {
                "entry_id": entry.entry_id,
                "title": entry.title,
                "selected": entry.entry_id in selected,
            }
            for entry in self.hass.config_entries.async_entries("imap")
        ]

    def installed_snapshot(self) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for source_name in ("installed", "custom"):
            for parser_id, state in self.storage.data.get(source_name, {}).items():
                parser = self.parsers.get(parser_id, {})
                metadata = parser.get("metadata", {}) if isinstance(parser, dict) else {}
                rows.append(
                    {
                        **dict(state),
                        "name": metadata.get("name", parser_id),
                        "provider": metadata.get("provider", ""),
                        "bill_type": metadata.get("bill_type", ""),
                        "country": metadata.get("country", ""),
                    }
                )
        return sorted(rows, key=lambda row: str(row.get("name", "")).casefold())

    def imports_snapshot(self, status: str | None = None, limit: int = 100) -> list[dict[str, Any]]:
        rows = self.storage.data.get("imports", [])
        if status:
            rows = [row for row in rows if row.get("status") == status]
        return [dict(row) for row in rows[: max(1, min(int(limit), 500))]]

    def get_import(self, import_id: str) -> dict[str, Any] | None:
        row = next((row for row in self.storage.data.get("imports", []) if row.get("id") == import_id), None)
        return dict(row) if row else None

    async def async_approve(self, import_id: str) -> dict[str, Any]:
        row = next((row for row in self.storage.data.get("imports", []) if row.get("id") == import_id), None)
        if row is None:
            raise ValueError("Import candidate not found")
        if row.get("status") == "imported":
            return dict(row)
        if row.get("status") not in {"pending", "error"}:
            raise ValueError("Import candidate cannot be approved")
        try:
            expense = await self.importer.async_import(row)
        except Exception as err:
            row["status"] = "error"
            row["error"] = str(err)
            await self.storage.async_save()
            self._notify_import_updated()
            raise
        row["status"] = "imported"
        row["expense_id"] = expense.get("id")
        row["error"] = ""
        row["imported_at"] = datetime.now().astimezone().isoformat(timespec="seconds")
        await self.storage.async_save()
        self._notify_import_updated()
        return dict(row)

    async def async_reject(self, import_id: str) -> dict[str, Any]:
        row = next((row for row in self.storage.data.get("imports", []) if row.get("id") == import_id), None)
        if row is None:
            raise ValueError("Import candidate not found")
        if row.get("status") == "imported":
            raise ValueError("Imported candidates cannot be rejected")
        row["status"] = "rejected"
        row["rejected_at"] = datetime.now().astimezone().isoformat(timespec="seconds")
        await self.storage.async_save()
        self._notify_import_updated()
        return dict(row)

    async def async_test(
        self,
        content: str,
        *,
        sender: str,
        subject: str,
        email_text: str,
        documents: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        parser = load_parser_yaml(content)
        envelope = MailEnvelope(entry_id="test", uid="test", sender=sender, subject=subject)
        bundle = DocumentBundle(email=email_text, documents=dict(documents or {}))
        prefilter = self.engine.prefilter(parser, envelope)
        matched, score, threshold = self.engine.detect(parser, envelope, bundle)
        parsed = self.engine.parse(parser, envelope, bundle) if matched else {"data": {}, "provenance": {}}
        return {
            "prefilter": prefilter,
            "matched": matched,
            "score": score,
            "threshold": threshold,
            "data": parsed["data"],
            "provenance": parsed["provenance"],
            "verification": self.engine.verification(parser, bundle) if matched else [],
        }

    async def _reload_installed(self) -> None:
        self.parsers = {}
        dirty = False
        for source_name in ("installed", "custom"):
            states = self.storage.data.get(source_name, {})
            for parser_id, state in list(states.items()):
                try:
                    parser, _content = await self.storage.async_load_parser_file(str(state.get("path") or ""))
                    if str(parser.get("id")) != parser_id:
                        raise ValueError("Parser ID does not match its stored identity")
                    self.parsers[parser_id] = parser
                except Exception as err:
                    _LOGGER.warning("Unable to load Billy parser %s: %s", parser_id, err)
                    state["enabled"] = False
                    state["load_error"] = str(err)
                    dirty = True
        if dirty:
            await self.storage.async_save()

    async def _documents_for(
        self,
        parser: dict[str, Any],
        envelope: MailEnvelope,
        email_text: str,
    ) -> tuple[DocumentBundle, list[str]]:
        bundle = DocumentBundle(email=email_text)
        hashes: list[str] = []
        for document in parser.get("documents", {}).get("attachments", []) or []:
            document_id = str(document.get("id") or "")
            part = self._find_part(document, envelope.parts)
            if part is None:
                if document.get("required", False):
                    raise ParserError(f"Required attachment '{document_id}' was not found")
                continue
            content = await self.imap.async_fetch_part(envelope, part)
            hashes.append(hashlib.sha256(content).hexdigest())
            extractor = document.get("extractor")
            if extractor == "pdf_text":
                text = await self.hass.async_add_executor_job(extract_pdf_text, content)
            elif extractor == "text":
                text = content.decode("utf-8", errors="replace")
            else:
                raise ParserError(f"Unsupported extractor '{extractor}'")
            bundle.documents[document_id] = text
        return bundle, hashes

    @staticmethod
    def _find_part(document: dict[str, Any], parts: list[MailPart]) -> MailPart | None:
        mime_types = {str(value).casefold() for value in document.get("mime_types", []) or []}
        filename_regex = str(document.get("filename_regex") or "")
        for part in parts:
            if mime_types and part.content_type.casefold() not in mime_types:
                continue
            if filename_regex and not re.search(filename_regex, part.filename or ""):
                continue
            return part
        return None

    @staticmethod
    def _merge_fetched_envelope(envelope: MailEnvelope, fetched: dict[str, Any]) -> MailEnvelope:
        parts: list[MailPart] = []
        for part_id, metadata in (fetched.get("parts") or {}).items():
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
        if parts:
            envelope.parts = parts
        envelope.sender = str(fetched.get("sender") or envelope.sender)
        envelope.subject = str(fetched.get("subject") or envelope.subject)
        return envelope

    def _candidate(
        self,
        *,
        parser_id: str,
        parser: dict[str, Any],
        config: dict[str, Any],
        envelope: MailEnvelope,
        parsed: dict[str, Any],
        score: int,
        threshold: int,
        verification: list[dict[str, Any]],
        source_fingerprint: str,
        attachment_hashes: list[str],
    ) -> BillCandidate:
        data = dict(parsed.get("data") or {})
        verified = [item for item in verification if item.get("match")]
        conflicts = [item for item in verification if not item.get("match")]
        confidence = min(90, round(score / max(threshold, 1) * 80))
        if verification:
            confidence += round(10 * len(verified) / len(verification))
        if conflicts:
            confidence = min(confidence, 79)
        semantic = self._semantic_fingerprint(parser_id, data)
        fingerprint = hashlib.sha256(
            "|".join([source_fingerprint, semantic, *attachment_hashes]).encode("utf-8")
        ).hexdigest()
        source = {
            "type": "imap",
            "entry_id": envelope.entry_id,
            "uid": envelope.uid,
            "sender": envelope.sender,
            "subject": envelope.subject,
            "date": envelope.date,
            "folder": envelope.folder,
            "source_fingerprint": source_fingerprint,
            "semantic_fingerprint": semantic,
        }
        return BillCandidate(
            id=uuid4().hex,
            parser_id=parser_id,
            parser_version=int(parser.get("version", 1)),
            category_id=str(config.get("category_id") or ""),
            data=data,
            confidence=confidence,
            matched_score=score,
            matched_threshold=threshold,
            verification=verification,
            source=source,
            fingerprint=fingerprint,
            created_at=datetime.now().astimezone().isoformat(timespec="seconds"),
        )

    async def _record_candidate(self, candidate: BillCandidate) -> None:
        imports = self.storage.data.setdefault("imports", [])
        imports.insert(0, candidate.as_dict())
        del imports[MAX_IMPORT_HISTORY:]
        await self.storage.async_save()
        self._notify_import_updated()

    async def _record_error(self, envelope: MailEnvelope, source_fingerprint: str, error: str) -> None:
        row = {
            "id": uuid4().hex,
            "parser_id": "",
            "parser_version": 0,
            "category_id": "",
            "data": {},
            "confidence": 0,
            "matched_score": 0,
            "matched_threshold": 0,
            "verification": [],
            "source": {
                "type": "imap",
                "entry_id": envelope.entry_id,
                "uid": envelope.uid,
                "sender": envelope.sender,
                "subject": envelope.subject,
                "date": envelope.date,
                "source_fingerprint": source_fingerprint,
            },
            "fingerprint": source_fingerprint,
            "status": "error",
            "created_at": datetime.now().astimezone().isoformat(timespec="seconds"),
            "expense_id": None,
            "error": error[:500],
        }
        imports = self.storage.data.setdefault("imports", [])
        imports.insert(0, row)
        del imports[MAX_IMPORT_HISTORY:]
        await self.storage.async_save()
        self._notify_import_updated()

    def _has_source_fingerprint(self, fingerprint: str) -> bool:
        return any(
            row.get("source", {}).get("source_fingerprint") == fingerprint
            for row in self.storage.data.get("imports", [])
        )

    def _is_duplicate_candidate(self, candidate: BillCandidate) -> bool:
        semantic = candidate.source.get("semantic_fingerprint")
        for row in self.storage.data.get("imports", []):
            if row.get("fingerprint") == candidate.fingerprint:
                return True
            if semantic and row.get("source", {}).get("semantic_fingerprint") == semantic:
                return True
        return False

    @staticmethod
    def _prefetch_fingerprint(envelope: MailEnvelope) -> str:
        payload = f"imap|{envelope.entry_id}|{envelope.uid}|{envelope.sender}|{envelope.subject}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    @staticmethod
    def _semantic_fingerprint(parser_id: str, data: dict[str, Any]) -> str:
        invoice = str(data.get("invoice_number") or "").strip()
        if invoice:
            payload = f"{parser_id}|invoice|{invoice}"
        else:
            payload = "|".join(
                [
                    parser_id,
                    str(data.get("provider") or ""),
                    str(data.get("amount") or ""),
                    str(data.get("period_start") or ""),
                    str(data.get("period_end") or ""),
                    str(data.get("due_date") or ""),
                ]
            )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def _ensure_category(self, category_id: str) -> None:
        if self.bill_manager.category(category_id) is None:
            raise ValueError("Billy bill type does not exist")

    def _version_supported(self, minimum: str) -> bool:
        def parts(value: str) -> tuple[int, int, int]:
            match = re.match(r"^(\d+)\.(\d+)\.(\d+)", value)
            return tuple(map(int, match.groups())) if match else (0, 0, 0)

        return parts(self.billy_version) >= parts(minimum)

    def _notify_import_updated(self) -> None:
        self.hass.bus.async_fire(EVENT_IMPORT_UPDATED)

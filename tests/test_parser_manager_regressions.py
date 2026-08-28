from pathlib import Path
import ast
import hashlib
import re
from dataclasses import dataclass
from types import SimpleNamespace
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / "custom_components" / "bill_tracker" / "parser" / "manager.py"
CATALOG = ROOT / "custom_components" / "bill_tracker" / "parser" / "catalog.py"


@dataclass
class MailPart:
    part: str
    content_type: str = ""
    filename: str = ""
    content_transfer_encoding: str = ""


def _load_method(name: str):
    tree = ast.parse(MANAGER.read_text(encoding="utf-8"))
    cls = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "ParserManager")
    fn = next(node for node in cls.body if isinstance(node, ast.FunctionDef) and node.name == name)
    fn.decorator_list = []
    module = ast.Module(body=[fn], type_ignores=[])
    ast.fix_missing_locations(module)
    ns = {"Any": Any, "MailPart": MailPart, "hashlib": hashlib, "re": re}
    exec(compile(module, str(MANAGER), "exec"), ns)
    return ns[name]


def _load_catalog_normalizer():
    tree = ast.parse(CATALOG.read_text(encoding="utf-8"))
    cls = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "ParserCatalogClient")
    fn = next(node for node in cls.body if isinstance(node, ast.FunctionDef) and node.name == "_normalize_catalog_item")
    fn.decorator_list = []
    module = ast.Module(body=[fn], type_ignores=[])
    ast.fix_missing_locations(module)
    ns = {"Any": Any}
    exec(compile(module, str(CATALOG), "exec"), ns)
    return ns["_normalize_catalog_item"]


class _CatalogClientHarness:
    def __init__(self):
        self._normalize = _load_catalog_normalizer()

    def _normalize_catalog_item(self, item):
        return self._normalize(item)


class _StorageHarness:
    def __init__(self, catalog, installed=None, custom=None):
        self.data = {
            "catalog": catalog,
            "community_id": "test-community-installation",
            "installed": installed or {},
            "custom": custom or {},
        }


class _ManagerHarness:
    def __init__(self, catalog, installed=None, custom=None):
        self.storage = _StorageHarness(catalog, installed, custom)
        self.catalog_client = _CatalogClientHarness()
        self.parsers = {}

    @staticmethod
    def catalog_country():
        return "IT"

    def _stored_catalog_for_country(self, _country):
        return dict(self.storage.data["catalog"])

    @staticmethod
    def _version_supported(_minimum):
        return True

    def community_fingerprint(self, parser_id, version):
        return f"fingerprint:{parser_id}:{version}"


def test_generic_binary_pdf_matches_restrictive_pdf_parser_by_filename():
    find_part = _load_method("_find_part")
    document = {
        "mime_types": ["application/pdf"],
        "filename_regex": r"(?i)^FATTURA_.*\.pdf$",
    }
    parts = [
        MailPart(
            part="1",
            content_type="application/octet-stream",
            filename="FATTURA_2026_41_TEST.pdf",
            content_transfer_encoding="base64",
        )
    ]
    assert find_part(document, parts) == parts[0]


def test_wrong_filename_does_not_bypass_mime_filter():
    find_part = _load_method("_find_part")
    document = {
        "mime_types": ["application/pdf"],
        "filename_regex": r"(?i)^FATTURA_.*\.pdf$",
    }
    parts = [MailPart(part="1", content_type="application/octet-stream", filename="image.bin")]
    assert find_part(document, parts) is None


def test_error_source_fingerprint_retries_once_per_runtime_without_log_loop():
    source = MANAGER.read_text(encoding="utf-8")
    assert "self._runtime_failed_fingerprints: set[str] = set()" in source
    assert "prefetch_key in self._runtime_failed_fingerprints" in source
    assert "existing_source = self._source_fingerprint_row(prefetch_key)" in source
    assert 'row.get("status") != "error"' in source
    assert "Persisted errors are deliberately excluded" in source
    assert "self._runtime_failed_fingerprints.add(source_fingerprint)" in source
    assert "self._runtime_failed_fingerprints.discard(source_fingerprint)" in source


def test_repeated_error_for_same_source_updates_existing_queue_row():
    source = MANAGER.read_text(encoding="utf-8")
    assert 'item.get("status") == "error"' in source
    assert "== source_fingerprint" in source
    assert "self._remove_source_errors(prefetch_key)" in source


def test_imap_ingestion_exposes_early_exit_diagnostics():
    source = MANAGER.read_text(encoding="utf-8")
    api = (ROOT / "custom_components" / "bill_tracker" / "parser_api.py").read_text(
        encoding="utf-8"
    )
    assert "self._last_ingestion" in source
    assert "IMAP source '" in source
    assert "No enabled Billy parser matched the email prefilter" in source
    assert "This IMAP message is already stored as" in source
    assert "import_id=" in source
    assert '"diagnostic": manager.ingestion_diagnostic()' in api


def test_stale_source_fingerprint_rows_are_removed_before_retry():
    source = MANAGER.read_text(encoding="utf-8")
    assert 'status == "pending" and (not parser_id or not data)' in source
    assert 'status == "imported" and not expense_id' in source
    assert "Billy removed stale import" in source
    assert "self._remove_import(existing_id)" in source


def test_empty_parser_split_falls_back_to_default_payer_at_100_percent():
    normalize = _load_method("_normalize_payment_defaults")

    class BillManager:
        @staticmethod
        def _validate_optional_payer(value):
            return value or None

        @staticmethod
        def default_split():
            return []

        @staticmethod
        def _normalize_split(split):
            return split

    manager = SimpleNamespace(bill_manager=BillManager())
    payer, split = normalize(manager, "payer-a", [])
    assert payer == "payer-a"
    assert split == [{"payer_id": "payer-a", "percentage": 100.0}]


def test_imap_fetches_retry_once_on_transient_home_assistant_errors():
    source = (ROOT / "custom_components" / "bill_tracker" / "sources" / "imap.py").read_text(
        encoding="utf-8"
    )
    assert "for attempt in range(2):" in source
    assert "await asyncio.sleep(0.25)" in source


def test_parser_can_continue_when_full_imap_fetch_fails_but_event_metadata_is_available():
    source = MANAGER.read_text(encoding="utf-8")
    assert "except ImapSourceError as err:" in source
    assert 'email_text = ""' in source
    assert "continuing with event metadata" in source
    assert "scored.append((score, threshold, parser_id, parser, config))" in source


def test_optional_attachment_fetch_failure_does_not_abort_parser():
    source = MANAGER.read_text(encoding="utf-8")
    assert "except (ImapSourceError, PdfExtractionError) as err:" in source
    assert "Billy skipped optional attachment" in source
    assert "continue" in source


def test_failed_import_retry_has_uuid_and_reprocesses_original_imap_uid():
    source = MANAGER.read_text(encoding="utf-8")
    api = (ROOT / "custom_components" / "bill_tracker" / "parser_api.py").read_text(
        encoding="utf-8"
    )
    assert "from uuid import uuid4" in source
    assert "async def async_retry" in source
    assert '"entry_id": source.get("entry_id")' in source
    assert '"uid": source.get("uid")' in source
    assert "retry_import_id=import_id" in source
    assert '"bill_tracker/parser/import/retry"' in api
    assert 'row.get("status") not in {"error", "rejected"}' in source


def test_candidate_uuid_generator_is_imported():
    tree = ast.parse(MANAGER.read_text(encoding="utf-8"))
    imports = {
        alias.name
        for node in tree.body
        if isinstance(node, ast.ImportFrom) and node.module == "uuid"
        for alias in node.names
    }
    assert "uuid4" in imports


def test_fetched_parts_preserve_original_metadata():
    source = MANAGER.read_text(encoding="utf-8")
    assert "merged: dict[str, MailPart] = {part.part: part for part in envelope.parts}" in source
    assert "previous.filename if previous else" in source


def test_catalog_snapshot_marks_outdated_and_removed_parsers():
    source = MANAGER.read_text(encoding="utf-8")
    assert 'status = "outdated"' in source
    assert '"removed_from_catalog": True' in source
    assert "installed_country != country" in source
    assert '"outdated": sum(1 for row in rows if row.get("status") == "outdated")' in source
    assert '"compatible": compatible' in source


def test_catalog_status_fallback_from_legacy_quality():
    normalize = _load_catalog_normalizer()
    assert normalize({"quality": "experimental"})["catalog_status"] == "experimental"
    assert normalize({"quality": "verified"})["catalog_status"] == "verified"
    assert normalize({"quality": "tested"})["catalog_status"] == "verified"
    assert normalize({"catalog_status": "verified"})["catalog_status"] == "verified"
    assert normalize({})["catalog_status"] == "experimental"


def test_catalog_refresh_uses_etag_cache_validation():
    source = CATALOG.read_text(encoding="utf-8")
    assert 'headers = {"If-None-Match": etag} if etag else None' in source
    assert "response.status == 304" in source
    assert '"catalog_cache"' in (
        ROOT / "custom_components" / "bill_tracker" / "parser" / "storage.py"
    ).read_text(encoding="utf-8")


def test_parser_catalog_country_prefers_explicit_option_then_home_assistant_then_it():
    resolve = _load_method("catalog_country")

    class Client:
        @staticmethod
        def normalize_country(value):
            text = str(value or "").strip().upper()
            return text if len(text) == 2 and text.isalpha() else None

    explicit = SimpleNamespace(
        config_entry=SimpleNamespace(options={"parser_country": "fr"}, data={}),
        hass=SimpleNamespace(config=SimpleNamespace(country="IT")),
        catalog_client=Client(),
    )
    assert resolve(explicit) == "FR"

    home_assistant = SimpleNamespace(
        config_entry=SimpleNamespace(options={}, data={}),
        hass=SimpleNamespace(config=SimpleNamespace(country="de")),
        catalog_client=Client(),
    )
    assert resolve(home_assistant) == "DE"

    fallback = SimpleNamespace(
        config_entry=None,
        hass=SimpleNamespace(config=SimpleNamespace(country=None)),
        catalog_client=Client(),
    )
    assert resolve(fallback) == "IT"


def test_catalog_status_is_preserved_after_runtime_merge():
    snapshot = _load_method("catalog_snapshot")
    catalog = {
        "parsers": [
            {"id": "it.enel.energy", "version": 1, "status": "experimental"},
            {"id": "it.eon.energy", "version": 1, "status": "verified"},
            {
                "id": "it.tim.generic",
                "version": 2,
                "status": "outdated",
                "replacement": "it.tim.internet",
            },
        ]
    }
    manager = _ManagerHarness(catalog)
    rows = {row["id"]: row for row in snapshot(manager)["parsers"]}
    assert rows["it.enel.energy"]["catalog_status"] == "experimental"
    assert rows["it.enel.energy"]["status"] == "available"
    assert rows["it.eon.energy"]["catalog_status"] == "verified"
    assert rows["it.eon.energy"]["status"] == "available"
    assert rows["it.tim.generic"]["catalog_status"] == "outdated"
    assert rows["it.tim.generic"]["status"] == "available"
    assert rows["it.tim.generic"]["replacement"] == "it.tim.internet"


def test_catalog_outdated_does_not_collide_with_runtime_update_available():
    snapshot = _load_method("catalog_snapshot")
    catalog = {
        "parsers": [
            {
                "id": "it.tim.generic",
                "version": 3,
                "status": "outdated",
                "replacement": "it.tim.internet",
            }
        ]
    }
    installed = {
        "it.tim.generic": {
            "id": "it.tim.generic",
            "version": 2,
            "enabled": True,
        }
    }
    row = snapshot(_ManagerHarness(catalog, installed))["parsers"][0]
    assert row["catalog_status"] == "outdated"
    assert row["status"] == "outdated"
    assert row["update_available"] is True
    assert row["replacement"] == "it.tim.internet"


def test_custom_parser_uses_custom_catalog_status():
    source = MANAGER.read_text(encoding="utf-8")
    assert '"catalog_status": "custom"' in source
    panel = (ROOT / "custom_components" / "bill_tracker" / "frontend" / "billy-parser-manager.js").read_text(encoding="utf-8")
    assert "catalog_status: 'custom'" in panel


def test_installed_and_available_runtime_status_remain_distinct():
    snapshot = _load_method("catalog_snapshot")
    catalog = {
        "parsers": [
            {"id": "it.eon.energy", "version": 1, "status": "verified"},
            {"id": "it.enel.energy", "version": 1, "status": "experimental"},
        ]
    }
    installed = {"it.eon.energy": {"id": "it.eon.energy", "version": 1, "enabled": True}}
    rows = {row["id"]: row for row in snapshot(_ManagerHarness(catalog, installed))["parsers"]}
    assert rows["it.eon.energy"]["status"] == "installed"
    assert rows["it.eon.energy"]["catalog_status"] == "verified"
    assert rows["it.enel.energy"]["status"] == "available"
    assert rows["it.enel.energy"]["catalog_status"] == "experimental"


def test_installed_parser_exposes_anonymous_version_scoped_feedback_fingerprint():
    snapshot = _load_method("catalog_snapshot")
    catalog = {
        "parsers": [
            {"id": "it.enel.energy", "version": 3, "status": "experimental"},
        ]
    }
    installed = {"it.enel.energy": {"id": "it.enel.energy", "version": 3, "enabled": True}}
    row = snapshot(_ManagerHarness(catalog, installed))["parsers"][0]
    assert row["feedback_fingerprint"] == "fingerprint:it.enel.energy:3"


def test_parser_storage_generates_persistent_community_id():
    storage = (
        ROOT / "custom_components" / "bill_tracker" / "parser" / "storage.py"
    ).read_text(encoding="utf-8")
    assert '"community_id": ""' in storage
    assert "community_id = uuid4().hex" in storage
    assert "await self._store.async_save(self.data)" in storage


def test_community_fingerprint_is_anonymous_and_version_scoped():
    fingerprint = _load_method("community_fingerprint")
    manager = SimpleNamespace(
        storage=SimpleNamespace(data={"community_id": "local-secret-installation-id"})
    )
    version_one = fingerprint(manager, "it.heracomm.energy", 1)
    version_two = fingerprint(manager, "it.heracomm.energy", 2)
    assert len(version_one) == 64
    assert version_one != version_two
    assert "local-secret-installation-id" not in version_one


def test_catalog_refresh_is_scheduled_daily_at_midnight():
    source = MANAGER.read_text(encoding="utf-8")
    assert "async_track_time_change" in source
    assert "self._handle_catalog_refresh" in source
    assert "hour=0" in source
    assert "minute=0" in source
    assert "second=0" in source
    assert "self._unsubscribe_catalog_refresh()" in source
    assert "daily parser catalog refresh failed" in source


def test_custom_parser_edit_locks_existing_parser_id():
    source = MANAGER.read_text(encoding="utf-8")
    assert "expected_parser_id: str | None = None" in source
    assert "if expected_parser_id is not None and parser_id != expected_parser_id" in source
    assert 'raise ValueError("Custom parser ID cannot be changed while editing")' in source

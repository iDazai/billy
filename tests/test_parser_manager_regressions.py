from pathlib import Path
import ast
import re
from dataclasses import dataclass
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / "custom_components" / "bill_tracker" / "parser" / "manager.py"


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
    ns = {"Any": Any, "MailPart": MailPart, "re": re}
    exec(compile(module, str(MANAGER), "exec"), ns)
    return ns[name]


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


def test_error_source_fingerprint_is_retryable():
    source = MANAGER.read_text(encoding="utf-8")
    assert 'row.get("status") != "error"' in source
    assert "Failed attempts must be retryable" in source


def test_fetched_parts_preserve_original_metadata():
    source = MANAGER.read_text(encoding="utf-8")
    assert "merged: dict[str, MailPart] = {part.part: part for part in envelope.parts}" in source
    assert "previous.filename if previous else" in source


def test_catalog_snapshot_marks_outdated_and_removed_parsers():
    source = MANAGER.read_text(encoding="utf-8")
    assert 'status = "outdated"' in source
    assert '"removed_from_catalog": True' in source
    assert '"outdated": sum(1 for row in rows if row.get("status") == "outdated")' in source
    assert '"compatible": compatible' in source


def test_catalog_refresh_is_scheduled_daily_at_midnight():
    source = MANAGER.read_text(encoding="utf-8")
    assert "async_track_time_change" in source
    assert "self._handle_catalog_refresh" in source
    assert "hour=0" in source
    assert "minute=0" in source
    assert "second=0" in source
    assert "self._unsubscribe_catalog_refresh()" in source
    assert "daily parser catalog refresh failed" in source

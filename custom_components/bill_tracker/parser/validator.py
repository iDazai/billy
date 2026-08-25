"""Lightweight runtime validation for downloaded/custom parser definitions."""
from __future__ import annotations

import re
from typing import Any

import yaml

from .engine import MAX_PATTERN_SIZE, ParserError

ALLOWED_RULE_SOURCES = {
    "email.from",
    "email.subject",
    "email.body",
    "attachment.filename",
    "attachment.mime_type",
}
ALLOWED_EXTRACTORS = {"pdf_text", "text"}
ALLOWED_TRANSFORMS = {"text", "decimal", "date", "date_range"}


class ParserValidationError(ParserError):
    """Parser is malformed or contains unsupported instructions."""


def load_parser_yaml(content: str) -> dict[str, Any]:
    if len(content.encode("utf-8")) > 256_000:
        raise ParserValidationError("Parser YAML is too large")
    try:
        data = yaml.safe_load(content)
    except yaml.YAMLError as err:
        raise ParserValidationError(f"Invalid YAML: {err}") from err
    if not isinstance(data, dict):
        raise ParserValidationError("Parser root must be an object")
    validate_parser(data)
    return data


def validate_parser(parser: dict[str, Any]) -> None:
    if parser.get("schema") != 1:
        raise ParserValidationError("Only parser schema 1 is supported")
    parser_id = str(parser.get("id") or "")
    if not re.fullmatch(r"[a-z0-9]+(?:[._-][a-z0-9]+)+", parser_id):
        raise ParserValidationError("Invalid parser id")
    version = parser.get("version")
    if not isinstance(version, int) or version < 1:
        raise ParserValidationError("Parser version must be a positive integer")

    metadata = parser.get("metadata")
    if not isinstance(metadata, dict):
        raise ParserValidationError("metadata is required")
    for key in ("name", "country", "language", "provider", "bill_type", "min_billy_version"):
        if not str(metadata.get(key) or "").strip():
            raise ParserValidationError(f"metadata.{key} is required")

    prefilter = parser.get("prefilter")
    if not isinstance(prefilter, dict) or not isinstance(prefilter.get("email"), dict):
        raise ParserValidationError("prefilter.email is required")
    email_prefilter = prefilter["email"]
    if not any(
        email_prefilter.get(key)
        for key in ("from", "subject_contains", "subject_regex")
    ):
        raise ParserValidationError(
            "prefilter.email must restrict sender or subject before content is fetched"
        )
    for pattern in email_prefilter.get("subject_regex", []) or []:
        _validate_regex(str(pattern))

    detection = parser.get("detection")
    if not isinstance(detection, dict):
        raise ParserValidationError("detection is required")
    threshold = detection.get("threshold")
    if not isinstance(threshold, int) or threshold < 1:
        raise ParserValidationError("detection.threshold must be a positive integer")
    rules = detection.get("rules")
    if not isinstance(rules, list) or not rules:
        raise ParserValidationError("detection.rules cannot be empty")
    if len(rules) > 30:
        raise ParserValidationError("Too many detection rules")
    for rule in rules:
        if not isinstance(rule, dict) or rule.get("source") not in ALLOWED_RULE_SOURCES:
            raise ParserValidationError("Unsupported detection source")
        operators = [key for key in ("equals", "contains", "regex") if key in rule]
        if len(operators) != 1:
            raise ParserValidationError("Each detection rule needs exactly one operator")
        if "regex" in rule:
            _validate_regex(str(rule["regex"]))
        weight = rule.get("weight")
        if not isinstance(weight, int) or weight < 1 or weight > 100:
            raise ParserValidationError("Detection weight must be between 1 and 100")

    documents = parser.get("documents")
    if not isinstance(documents, dict):
        raise ParserValidationError("documents is required")
    document_ids = {"email"}
    for attachment in documents.get("attachments", []) or []:
        if not isinstance(attachment, dict):
            raise ParserValidationError("Invalid attachment document")
        document_id = str(attachment.get("id") or "")
        if not document_id:
            raise ParserValidationError("Attachment document id is required")
        if document_id in document_ids:
            raise ParserValidationError(f"Duplicate document id: {document_id}")
        document_ids.add(document_id)
        if attachment.get("extractor") not in ALLOWED_EXTRACTORS:
            raise ParserValidationError("Unsupported document extractor")
        if attachment.get("filename_regex"):
            _validate_regex(str(attachment["filename_regex"]))

    fields = parser.get("fields")
    if not isinstance(fields, dict) or not fields:
        raise ParserValidationError("fields cannot be empty")
    for name, field in fields.items():
        if not isinstance(field, dict):
            raise ParserValidationError(f"Field {name} must be an object")
        if "value" not in field and not field.get("candidates"):
            raise ParserValidationError(f"Field {name} needs value or candidates")
        candidates = field.get("candidates", []) or []
        if len(candidates) > 20:
            raise ParserValidationError(f"Field {name} has too many candidates")
        for candidate in candidates:
            if not isinstance(candidate, dict):
                raise ParserValidationError(f"Invalid candidate in {name}")
            source = str(candidate.get("source") or "")
            if not source:
                raise ParserValidationError(f"Candidate source missing in {name}")
            if source not in document_ids:
                raise ParserValidationError(
                    f"Candidate source {source!r} in {name} is not a declared document"
                )
            _validate_regex(str(candidate.get("regex") or ""))
        transform = field.get("transform") or {"type": "text"}
        if transform.get("type", "text") not in ALLOWED_TRANSFORMS:
            raise ParserValidationError(f"Unsupported transform in {name}")


def _validate_regex(pattern: str) -> None:
    if not pattern or len(pattern) > MAX_PATTERN_SIZE:
        raise ParserValidationError("Regex is empty or too large")
    try:
        re.compile(pattern)
    except re.error as err:
        raise ParserValidationError(f"Invalid regular expression: {err}") from err

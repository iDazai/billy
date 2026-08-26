"""Normalize email bodies without external HTML dependencies."""
from __future__ import annotations

import html
import re
from html.parser import HTMLParser


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        if data.strip():
            self.parts.append(data)

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in {"br", "p", "div", "li", "tr", "h1", "h2", "h3", "h4"}:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"p", "div", "li", "tr", "h1", "h2", "h3", "h4"}:
            self.parts.append("\n")


def normalize_email_text(text: str) -> str:
    """Return a bounded, whitespace-normalized plain-text email representation."""
    value = text or ""
    if re.search(r"<\s*(?:html|body|div|p|table|br)\b", value, re.IGNORECASE):
        parser = _TextExtractor()
        try:
            parser.feed(value)
            value = "".join(parser.parts)
        except Exception:
            value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = value.replace("\r\n", "\n").replace("\r", "\n")
    value = re.sub(r"[\t ]+", " ", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()[:1_500_000]

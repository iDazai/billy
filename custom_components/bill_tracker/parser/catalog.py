"""Remote parser catalog client."""
from __future__ import annotations

import hashlib
import json
from typing import Any

from aiohttp import ClientError, ClientTimeout
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .validator import load_parser_yaml

DEFAULT_CATALOG_URL = "https://raw.githubusercontent.com/robin994/billy-parser/main/parser.json"
DEFAULT_RAW_BASE = "https://raw.githubusercontent.com/robin994/billy-parser"
MAX_CATALOG_BYTES = 1_000_000
MAX_PARSER_BYTES = 256_000


class CatalogError(RuntimeError):
    """Unable to fetch or validate the remote catalog."""


class ParserCatalogClient:
    def __init__(self, hass: HomeAssistant, catalog_url: str = DEFAULT_CATALOG_URL) -> None:
        self.hass = hass
        self.catalog_url = catalog_url

    async def async_fetch_catalog(self) -> dict[str, Any]:
        raw = await self._get(self.catalog_url, MAX_CATALOG_BYTES)
        try:
            catalog = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as err:
            raise CatalogError("Remote parser catalog is not valid JSON") from err
        if not isinstance(catalog, dict) or catalog.get("schema_version") != 1:
            raise CatalogError("Unsupported parser catalog schema")
        if not isinstance(catalog.get("parsers"), list):
            raise CatalogError("Remote parser catalog is malformed")
        source_commit = str(catalog.get("source_commit") or "").strip()
        if not source_commit:
            raise CatalogError("Remote parser catalog has no source_commit")
        return catalog

    async def async_fetch_parser(
        self,
        catalog: dict[str, Any],
        item: dict[str, Any],
    ) -> tuple[dict[str, Any], str]:
        source_commit = str(catalog.get("source_commit") or "").strip()
        path = str(item.get("path") or "").lstrip("/")
        if not source_commit or not path or ".." in path.split("/"):
            raise CatalogError("Invalid parser catalog path")
        url = f"{DEFAULT_RAW_BASE}/{source_commit}/{path}"
        raw = await self._get(url, MAX_PARSER_BYTES)
        expected_size = int(item.get("size") or 0)
        if expected_size and len(raw) != expected_size:
            raise CatalogError("Downloaded parser size does not match the catalog")
        digest = hashlib.sha256(raw).hexdigest()
        expected_digest = str(item.get("sha256") or "").lower()
        if expected_digest and digest != expected_digest:
            raise CatalogError("Downloaded parser checksum does not match the catalog")
        try:
            content = raw.decode("utf-8")
        except UnicodeDecodeError as err:
            raise CatalogError("Downloaded parser is not UTF-8") from err
        parser = load_parser_yaml(content)
        if parser.get("id") != item.get("id") or int(parser.get("version", 0)) != int(item.get("version", -1)):
            raise CatalogError("Downloaded parser identity does not match the catalog")
        return parser, content

    async def _get(self, url: str, max_bytes: int) -> bytes:
        session = async_get_clientsession(self.hass)
        try:
            async with session.get(url, timeout=ClientTimeout(total=20)) as response:
                if response.status != 200:
                    raise CatalogError(f"HTTP {response.status} while downloading parser data")
                length = response.content_length
                if length is not None and length > max_bytes:
                    raise CatalogError("Remote parser data is too large")
                raw = await response.read()
        except (ClientError, TimeoutError) as err:
            raise CatalogError("Unable to reach the parser repository") from err
        if len(raw) > max_bytes:
            raise CatalogError("Remote parser data is too large")
        return raw

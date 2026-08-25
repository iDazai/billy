"""Authenticated HTTP endpoints for parser file exports."""
from __future__ import annotations

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_REGISTERED_KEY = "parser_http_registered"


class BillyCustomParserDownloadView(HomeAssistantView):
    """Download a locally stored custom parser as YAML."""

    url = "/api/bill_tracker/parser/custom/{parser_id}"
    name = "api:bill_tracker:parser:custom"
    requires_auth = True

    async def get(self, request: web.Request, parser_id: str) -> web.Response:
        hass: HomeAssistant = request.app["hass"]
        manager = hass.data.get(DOMAIN, {}).get("parser_manager")
        if manager is None:
            raise web.HTTPServiceUnavailable(text="Billy parser subsystem is not available")
        try:
            filename, content = await manager.async_export_custom(parser_id)
        except ValueError as err:
            raise web.HTTPNotFound(text=str(err)) from err
        safe_filename = filename.replace('"', "")
        return web.Response(
            text=content,
            content_type="application/yaml",
            charset="utf-8",
            headers={"Content-Disposition": f'attachment; filename="{safe_filename}"'},
        )


def register_parser_http(hass: HomeAssistant) -> None:
    """Register parser download route once per Home Assistant process."""
    data = hass.data.setdefault(DOMAIN, {})
    if data.get(_REGISTERED_KEY):
        return
    hass.http.register_view(BillyCustomParserDownloadView())
    data[_REGISTERED_KEY] = True

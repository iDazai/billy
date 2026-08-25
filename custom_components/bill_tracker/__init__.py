"""Bill Tracker integration for Home Assistant."""
from __future__ import annotations

import base64
import inspect
import logging
from datetime import datetime
from pathlib import Path

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_ID, CONF_TYPE, CONF_URL
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, FRONTEND_VERSION, SUPPORTED_INTERVALS
from .manager import BillTrackerManager

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor"]
FRONTEND_DIR = Path(__file__).parent / "frontend"
FRONTEND_PATH = FRONTEND_DIR / "bill-tracker-card.js"
FRONTEND_IMPL_PATH = FRONTEND_DIR / "bill-tracker-card-impl.js"
FRONTEND_I18N_PATH = FRONTEND_DIR / "bill-tracker-i18n.js"
FRONTEND_URL = "/bill_tracker/bill-tracker-card.js"
FRONTEND_IMPL_URL = "/bill_tracker/bill-tracker-card-impl.js"
FRONTEND_I18N_URL = "/bill_tracker/bill-tracker-i18n.js"
FRONTEND_MODULE_URL = f"{FRONTEND_URL}?v={FRONTEND_VERSION}"


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Register Billy as a Lovelace module in addition to the global frontend URL.

    Home Assistant currently does not await every custom frontend module before
    dashboard/card-picker rendering. Registering Billy through both supported
    paths, while keeping the globally injected module as a tiny bootstrap, makes
    cold loads considerably more reliable. Failures here are non-fatal because
    add_extra_js_url remains the fallback.
    """
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA
        from homeassistant.components.lovelace.resources import ResourceStorageCollection

        lovelace_data = hass.data.get(LOVELACE_DATA)
        if lovelace_data is None:
            return
        resources = lovelace_data.resources
        if not isinstance(resources, ResourceStorageCollection):
            # YAML resource mode is read-only from an integration; the global
            # frontend module registration below remains the fallback.
            return

        ensure_loaded = getattr(resources, "_async_ensure_loaded", None)
        if ensure_loaded is not None:
            await ensure_loaded()
        elif not getattr(resources, "loaded", True):
            # Compatibility guard for HA versions before ResourceStorageCollection
            # grew its lazy-load protection. Never mutate an unloaded collection.
            await resources.async_load()
            try:
                resources.loaded = True
            except AttributeError:
                pass

        items = resources.async_items()
        if inspect.isawaitable(items):
            items = await items
        items = items or []
        matches = [
            item
            for item in items
            if str(item.get(CONF_URL, "")).split("?", 1)[0] == FRONTEND_URL
        ]
        if matches:
            item = matches[0]
            if item.get(CONF_URL) != FRONTEND_MODULE_URL or item.get(CONF_TYPE) != "module":
                await resources.async_update_item(
                    item[CONF_ID],
                    {"res_type": "module", CONF_URL: FRONTEND_MODULE_URL},
                )
        else:
            await resources.async_create_item(
                {"res_type": "module", CONF_URL: FRONTEND_MODULE_URL}
            )
    except Exception:  # noqa: BLE001 - frontend fallback must stay available
        _LOGGER.exception("Could not register Billy as a Lovelace resource")


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Bill Tracker and its frontend module."""
    for command in (
        ws_list,
        ws_add,
        ws_delete,
        ws_update,
        ws_set_paid,
        ws_category_add,
        ws_category_update,
        ws_category_delete,
        ws_payer_add,
        ws_payer_update,
        ws_payer_delete,
        ws_settlement_add,
        ws_settlement_delete,
        ws_import_csv,
        ws_export,
        ws_export_template,
    ):
        websocket_api.async_register_command(hass, command)

    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(FRONTEND_URL, str(FRONTEND_PATH), False),
            StaticPathConfig(FRONTEND_IMPL_URL, str(FRONTEND_IMPL_PATH), False),
            StaticPathConfig(FRONTEND_I18N_URL, str(FRONTEND_I18N_PATH), False),
        ]
    )

    # The globally injected file is intentionally only the tiny bootstrap. It
    # registers bill-tracker-card + its editor synchronously, then lazy-loads
    # the larger implementation module behind those stable host elements.
    add_extra_js_url(hass, FRONTEND_MODULE_URL)
    await _async_register_lovelace_resource(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Bill Tracker from a config entry."""
    manager = BillTrackerManager(hass)
    await manager.async_load()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = manager
    hass.data[DOMAIN]["manager"] = manager
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Bill Tracker config entry."""
    ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if ok:
        manager = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
        if hass.data.get(DOMAIN, {}).get("manager") is manager:
            hass.data[DOMAIN].pop("manager", None)
    return ok


def _manager(hass: HomeAssistant) -> BillTrackerManager:
    manager = hass.data.get(DOMAIN, {}).get("manager")
    if manager is None:
        raise RuntimeError("Bill Tracker non è configurato")
    return manager


@websocket_api.websocket_command(
    {
        vol.Required("type"): "bill_tracker/list",
        vol.Optional("forecast_months", default=12): vol.All(vol.Coerce(int), vol.Range(min=1, max=24)),
    }
)
@websocket_api.async_response
async def ws_list(hass, connection, msg):
    try:
        result = _manager(hass).snapshot(msg["forecast_months"])
    except RuntimeError as err:
        connection.send_error(msg["id"], "not_configured", str(err))
        return
    connection.send_result(msg["id"], result)


_SPLIT_ITEM_SCHEMA = vol.Schema(
    {
        vol.Required("payer_id"): str,
        vol.Required("percentage"): vol.Coerce(float),
    }
)

_EXPENSE_SCHEMA = {
    vol.Required("year"): vol.Coerce(int),
    vol.Required("month"): vol.All(vol.Coerce(int), vol.Range(min=1, max=12)),
    vol.Optional("category_id"): str,
    vol.Optional("category"): str,
    vol.Required("amount"): vol.Coerce(float),
    vol.Optional("note", default=""): str,
    vol.Optional("period_start_year"): vol.Coerce(int),
    vol.Optional("period_start_month"): vol.All(vol.Coerce(int), vol.Range(min=1, max=12)),
    vol.Optional("period_end_year"): vol.Coerce(int),
    vol.Optional("period_end_month"): vol.All(vol.Coerce(int), vol.Range(min=1, max=12)),
    vol.Optional("payer_id"): str,
    vol.Optional("split"): [_SPLIT_ITEM_SCHEMA],
    vol.Optional("paid"): bool,
    vol.Optional("payment_date"): str,
    vol.Optional("due_date"): str,
    vol.Optional("provider"): str,
    vol.Optional("contract"): str,
    vol.Optional("consumption"): vol.Coerce(float),
}


def _expense_kwargs(msg):
    return {
        "year": msg["year"],
        "month": msg["month"],
        "category_id": msg.get("category_id"),
        "category_name": msg.get("category"),
        "amount": msg["amount"],
        "note": msg["note"],
        "period_start_year": msg.get("period_start_year"),
        "period_start_month": msg.get("period_start_month"),
        "period_end_year": msg.get("period_end_year"),
        "period_end_month": msg.get("period_end_month"),
        "payer_id": msg.get("payer_id"),
        "split": msg.get("split"),
        "paid": msg.get("paid"),
        "payment_date": msg.get("payment_date"),
        "due_date": msg.get("due_date"),
        "provider": msg.get("provider"),
        "contract": msg.get("contract"),
        "consumption": msg.get("consumption"),
    }


@websocket_api.websocket_command({vol.Required("type"): "bill_tracker/add", **_EXPENSE_SCHEMA})
@websocket_api.async_response
async def ws_add(hass, connection, msg):
    try:
        item = await _manager(hass).async_add(**_expense_kwargs(msg))
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_expense", str(err))
        return
    connection.send_result(msg["id"], item)


@websocket_api.websocket_command(
    {vol.Required("type"): "bill_tracker/update", vol.Required("expense_id"): str, **_EXPENSE_SCHEMA}
)
@websocket_api.async_response
async def ws_update(hass, connection, msg):
    try:
        item = await _manager(hass).async_update(msg["expense_id"], **_expense_kwargs(msg))
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_expense", str(err))
        return
    if item is None:
        connection.send_error(msg["id"], "not_found", "Spesa non trovata")
        return
    connection.send_result(msg["id"], item)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "bill_tracker/set_paid",
        vol.Required("expense_id"): str,
        vol.Required("paid"): bool,
    }
)
@websocket_api.async_response
async def ws_set_paid(hass, connection, msg):
    try:
        item = await _manager(hass).async_set_paid(msg["expense_id"], msg["paid"])
    except RuntimeError as err:
        connection.send_error(msg["id"], "not_configured", str(err))
        return
    if item is None:
        connection.send_error(msg["id"], "not_found", "Spesa non trovata")
        return
    connection.send_result(msg["id"], item)


@websocket_api.websocket_command(
    {vol.Required("type"): "bill_tracker/delete", vol.Required("expense_id"): str}
)
@websocket_api.async_response
async def ws_delete(hass, connection, msg):
    try:
        deleted = await _manager(hass).async_delete(msg["expense_id"])
    except RuntimeError as err:
        connection.send_error(msg["id"], "not_configured", str(err))
        return
    connection.send_result(msg["id"], {"deleted": deleted})


_CATEGORY_COMMON = {
    vol.Required("name"): str,
    vol.Required("interval_months"): vol.In(SUPPORTED_INTERVALS),
    vol.Optional("enabled", default=True): bool,
    vol.Optional("default_payer_id"): str,
    vol.Optional("color"): str,
    vol.Optional("consumption_unit", default=""): str,
    vol.Optional("default_provider", default=""): str,
    vol.Optional("default_contract", default=""): str,
}


@websocket_api.websocket_command({vol.Required("type"): "bill_tracker/category/add", **_CATEGORY_COMMON})
@websocket_api.async_response
async def ws_category_add(hass, connection, msg):
    try:
        category = await _manager(hass).async_add_category(
            name=msg["name"],
            interval_months=msg["interval_months"],
            enabled=msg["enabled"],
            default_payer_id=msg.get("default_payer_id"),
            color=msg.get("color"),
            consumption_unit=msg.get("consumption_unit", ""),
            default_provider=msg.get("default_provider", ""),
            default_contract=msg.get("default_contract", ""),
        )
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_category", str(err))
        return
    connection.send_result(msg["id"], category)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "bill_tracker/category/update",
        vol.Required("category_id"): str,
        **_CATEGORY_COMMON,
    }
)
@websocket_api.async_response
async def ws_category_update(hass, connection, msg):
    try:
        category = await _manager(hass).async_update_category(
            msg["category_id"],
            name=msg["name"],
            interval_months=msg["interval_months"],
            enabled=msg["enabled"],
            default_payer_id=msg.get("default_payer_id"),
            color=msg.get("color"),
            consumption_unit=msg.get("consumption_unit", ""),
            default_provider=msg.get("default_provider", ""),
            default_contract=msg.get("default_contract", ""),
        )
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_category", str(err))
        return
    if category is None:
        connection.send_error(msg["id"], "not_found", "Tipo di bolletta non trovato")
        return
    connection.send_result(msg["id"], category)


@websocket_api.websocket_command(
    {vol.Required("type"): "bill_tracker/category/delete", vol.Required("category_id"): str}
)
@websocket_api.async_response
async def ws_category_delete(hass, connection, msg):
    try:
        deleted = await _manager(hass).async_delete_category(msg["category_id"])
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "category_in_use", str(err))
        return
    connection.send_result(msg["id"], {"deleted": deleted})


_PAYER_COMMON = {
    vol.Required("name"): str,
    vol.Optional("share_percent", default=50.0): vol.All(vol.Coerce(float), vol.Range(min=0, max=100)),
    vol.Optional("paypal_me", default=""): str,
    vol.Optional("enabled", default=True): bool,
}


@websocket_api.websocket_command({vol.Required("type"): "bill_tracker/payer/add", **_PAYER_COMMON})
@websocket_api.async_response
async def ws_payer_add(hass, connection, msg):
    try:
        payer = await _manager(hass).async_add_payer(
            name=msg["name"],
            share_percent=msg["share_percent"],
            paypal_me=msg["paypal_me"],
            enabled=msg["enabled"],
        )
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_payer", str(err))
        return
    connection.send_result(msg["id"], payer)


@websocket_api.websocket_command(
    {vol.Required("type"): "bill_tracker/payer/update", vol.Required("payer_id"): str, **_PAYER_COMMON}
)
@websocket_api.async_response
async def ws_payer_update(hass, connection, msg):
    try:
        payer = await _manager(hass).async_update_payer(
            msg["payer_id"],
            name=msg["name"],
            share_percent=msg["share_percent"],
            paypal_me=msg["paypal_me"],
            enabled=msg["enabled"],
        )
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_payer", str(err))
        return
    if payer is None:
        connection.send_error(msg["id"], "not_found", "Pagante non trovato")
        return
    connection.send_result(msg["id"], payer)


@websocket_api.websocket_command(
    {vol.Required("type"): "bill_tracker/payer/delete", vol.Required("payer_id"): str}
)
@websocket_api.async_response
async def ws_payer_delete(hass, connection, msg):
    try:
        deleted = await _manager(hass).async_delete_payer(msg["payer_id"])
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "payer_in_use", str(err))
        return
    connection.send_result(msg["id"], {"deleted": deleted})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "bill_tracker/settlement/add",
        vol.Required("from_payer_id"): str,
        vol.Required("to_payer_id"): str,
        vol.Required("amount"): vol.Coerce(float),
        vol.Optional("note", default=""): str,
    }
)
@websocket_api.async_response
async def ws_settlement_add(hass, connection, msg):
    try:
        item = await _manager(hass).async_add_settlement(
            from_payer_id=msg["from_payer_id"],
            to_payer_id=msg["to_payer_id"],
            amount=msg["amount"],
            note=msg["note"],
        )
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_settlement", str(err))
        return
    connection.send_result(msg["id"], item)


@websocket_api.websocket_command(
    {vol.Required("type"): "bill_tracker/settlement/delete", vol.Required("settlement_id"): str}
)
@websocket_api.async_response
async def ws_settlement_delete(hass, connection, msg):
    try:
        deleted = await _manager(hass).async_delete_settlement(msg["settlement_id"])
    except RuntimeError as err:
        connection.send_error(msg["id"], "not_configured", str(err))
        return
    connection.send_result(msg["id"], {"deleted": deleted})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "bill_tracker/import_csv",
        vol.Required("content"): vol.All(str, vol.Length(max=5_000_000)),
        vol.Optional("create_missing_categories", default=True): bool,
        vol.Optional("create_missing_payers", default=True): bool,
    }
)
@websocket_api.async_response
async def ws_import_csv(hass, connection, msg):
    try:
        result = await _manager(hass).async_import_csv(
            msg["content"],
            create_missing_categories=msg["create_missing_categories"],
            create_missing_payers=msg["create_missing_payers"],
        )
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "invalid_csv", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "bill_tracker/export",
        vol.Required("format"): vol.In(("csv", "xlsx", "pdf")),
        vol.Optional("from_month", default=""): str,
        vol.Optional("to_month", default=""): str,
        vol.Optional("status", default="all"): vol.In(("all", "paid", "unpaid")),
        vol.Optional("category_id", default="all"): str,
        vol.Optional("trend", default="both"): vol.In(("payments", "normalized", "both")),
        vol.Optional("language", default="en"): str,
    }
)
@websocket_api.async_response
async def ws_export(hass, connection, msg):
    try:
        payload, mime_type, extension = _manager(hass).export_data(
            file_format=msg["format"],
            from_month=msg.get("from_month") or None,
            to_month=msg.get("to_month") or None,
            status=msg["status"],
            category_id=msg.get("category_id") or "all",
            trend=msg["trend"],
            language=msg.get("language", "en"),
        )
    except (ValueError, RuntimeError) as err:
        connection.send_error(msg["id"], "export_failed", str(err))
        return
    stamp = datetime.now().strftime("%Y%m%d-%H%M")
    from_part = (msg.get("from_month") or "all").replace("-", "")
    to_part = (msg.get("to_month") or "all").replace("-", "")
    filename = f"billy-{from_part}-{to_part}-{stamp}.{extension}"
    connection.send_result(
        msg["id"],
        {
            "filename": filename,
            "mime_type": mime_type,
            "content_base64": base64.b64encode(payload).decode("ascii"),
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "bill_tracker/export_template"})
@websocket_api.async_response
async def ws_export_template(hass, connection, msg):
    try:
        payload = _manager(hass).export_csv_template()
    except RuntimeError as err:
        connection.send_error(msg["id"], "not_configured", str(err))
        return
    connection.send_result(
        msg["id"],
        {
            "filename": "billy-import-template.csv",
            "mime_type": "text/csv;charset=utf-8",
            "content_base64": base64.b64encode(payload).decode("ascii"),
        },
    )

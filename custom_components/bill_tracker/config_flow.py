"""Config and options flows for Bill Tracker."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback

from .const import DOMAIN, PROJECT_URL, SUPPORT_URL, SUPPORTED_INTERVALS
from .localization import category_label, config_label, interval_label, normalize_language
from .manager import BillTrackerManager

NO_DEFAULT_PAYER = "__none__"


class BillTrackerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the initial Bill Tracker setup."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="Bill Tracker", data={})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return BillTrackerOptionsFlow()


class BillTrackerOptionsFlow(config_entries.OptionsFlow):
    """Manage bill types and payers from native Home Assistant settings."""

    def __init__(self) -> None:
        self._category_id: str | None = None
        self._payer_id: str | None = None

    def _manager(self) -> BillTrackerManager | None:
        return self.hass.data.get(DOMAIN, {}).get("manager")

    def _language(self) -> str:
        return normalize_language(getattr(self.hass.config, "language", "en"))

    def _label(self, key: str) -> str:
        return config_label(self._language(), key)

    async def async_step_init(self, user_input: dict[str, Any] | None = None):
        if self._manager() is None:
            return self.async_abort(reason="not_setup")
        return self.async_show_menu(
            step_id="init",
            menu_options=[
                "add_payer",
                "manage_payer",
                "add_category",
                "manage_category",
                "support",
                "done",
            ],
        )

    # ------------------------------------------------------------------
    # Payers
    # ------------------------------------------------------------------
    async def async_step_add_payer(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                await manager.async_add_payer(
                    name=user_input["name"],
                    share_percent=float(user_input["share_percent"]),
                    paypal_me=user_input.get("paypal_me", ""),
                    enabled=bool(user_input["enabled"]),
                )
            except ValueError:
                errors["base"] = "invalid_payer"
            else:
                return await self.async_step_init()
        schema = vol.Schema(
            {
                vol.Required("name"): str,
                vol.Required("share_percent", default=50.0): vol.All(
                    vol.Coerce(float), vol.Range(min=0, max=100)
                ),
                vol.Optional("paypal_me", default=""): str,
                vol.Required("enabled", default=True): bool,
            }
        )
        return self.async_show_form(step_id="add_payer", data_schema=schema, errors=errors)

    async def async_step_manage_payer(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        if not manager.payers:
            return await self.async_step_add_payer()
        if user_input is not None:
            self._payer_id = str(user_input["payer_id"])
            if user_input["action"] == "delete":
                return await self.async_step_delete_payer()
            return await self.async_step_edit_payer()
        payers = {
            str(item["id"]): (
                f"{item['name']} — {self._label('share')} {float(item.get('share_percent', 0)):g}%"
                + ("" if item.get("enabled", True) else f" — {self._label('disabled')}")
            )
            for item in manager.payers
        }
        return self.async_show_form(
            step_id="manage_payer",
            data_schema=vol.Schema(
                {
                    vol.Required("payer_id"): vol.In(payers),
                    vol.Required("action", default="edit"): vol.In(
                        {"edit": self._label("edit"), "delete": self._label("delete")}
                    ),
                }
            ),
        )

    async def async_step_edit_payer(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        item = manager.payer(self._payer_id or "")
        if item is None:
            return self.async_abort(reason="payer_not_found")
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                await manager.async_update_payer(
                    str(item["id"]),
                    name=user_input["name"],
                    share_percent=float(user_input["share_percent"]),
                    paypal_me=user_input.get("paypal_me", ""),
                    enabled=bool(user_input["enabled"]),
                )
            except ValueError:
                errors["base"] = "invalid_payer"
            else:
                self._payer_id = None
                return await self.async_step_init()
        schema = vol.Schema(
            {
                vol.Required("name", default=str(item["name"])): str,
                vol.Required("share_percent", default=float(item.get("share_percent", 50.0))): vol.All(
                    vol.Coerce(float), vol.Range(min=0, max=100)
                ),
                vol.Optional("paypal_me", default=str(item.get("paypal_me", ""))): str,
                vol.Required("enabled", default=bool(item.get("enabled", True))): bool,
            }
        )
        return self.async_show_form(step_id="edit_payer", data_schema=schema, errors=errors)

    async def async_step_delete_payer(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        item = manager.payer(self._payer_id or "")
        if item is None:
            return self.async_abort(reason="payer_not_found")
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                await manager.async_delete_payer(str(item["id"]))
            except ValueError:
                errors["base"] = "payer_in_use"
            else:
                self._payer_id = None
                return await self.async_step_init()
        return self.async_show_form(
            step_id="delete_payer",
            data_schema=vol.Schema({}),
            errors=errors,
            description_placeholders={"name": str(item["name"])},
        )

    # ------------------------------------------------------------------
    # Categories
    # ------------------------------------------------------------------
    def _category_schema(self, manager: BillTrackerManager, item: dict[str, Any] | None = None):
        interval_choices = {str(value): interval_label(self._language(), value) for value in SUPPORTED_INTERVALS}
        # Home Assistant option selectors do not reliably preserve an empty-string
        # option. Use an explicit sentinel so "no default payer" is always
        # selectable, and expose every configured payer (disabled ones are tagged).
        payer_choices = {NO_DEFAULT_PAYER: self._label("none")}
        payer_choices.update(
            {str(p["id"]): str(p["name"]) for p in manager.payers if p.get("enabled", True)}
        )
        if item and item.get("default_payer_id"):
            selected = manager.payer(str(item["default_payer_id"]))
            if selected:
                payer_choices.setdefault(
                    str(selected["id"]),
                    f"{selected['name']}{'' if selected.get('enabled', True) else f' — {self._label("disabled")}'}",
                )
        return vol.Schema(
            {
                vol.Required("name", default=str(item["name"]) if item else ""): str,
                vol.Required(
                    "interval_months",
                    default=str(item["interval_months"]) if item else "1",
                ): vol.In(interval_choices),
                vol.Required(
                    "default_payer_id",
                    default=str(item.get("default_payer_id") or NO_DEFAULT_PAYER) if item else NO_DEFAULT_PAYER,
                ): vol.In(payer_choices),
                vol.Optional(
                    "color",
                    default=str(item.get("color", "#5B8FF9")) if item else "#5B8FF9",
                ): str,
                vol.Optional(
                    "consumption_unit",
                    default=str(item.get("consumption_unit", "")) if item else "",
                ): str,
                vol.Optional(
                    "default_provider",
                    default=str(item.get("default_provider", "")) if item else "",
                ): str,
                vol.Optional(
                    "default_contract",
                    default=str(item.get("default_contract", "")) if item else "",
                ): str,
                vol.Required(
                    "enabled", default=bool(item.get("enabled", True)) if item else True
                ): bool,
            }
        )

    async def async_step_add_category(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                await manager.async_add_category(
                    name=user_input["name"],
                    interval_months=int(user_input["interval_months"]),
                    enabled=bool(user_input["enabled"]),
                    default_payer_id=(
                        None
                        if user_input.get("default_payer_id") in (None, "", NO_DEFAULT_PAYER)
                        else str(user_input["default_payer_id"])
                    ),
                    color=user_input.get("color"),
                    consumption_unit=user_input.get("consumption_unit", ""),
                    default_provider=user_input.get("default_provider", ""),
                    default_contract=user_input.get("default_contract", ""),
                )
            except ValueError:
                errors["base"] = "invalid_category"
            else:
                return await self.async_step_init()
        return self.async_show_form(
            step_id="add_category",
            data_schema=self._category_schema(manager),
            errors=errors,
        )

    async def async_step_manage_category(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        if not manager.categories:
            return await self.async_step_add_category()
        if user_input is not None:
            self._category_id = str(user_input["category_id"])
            if user_input["action"] == "delete":
                return await self.async_step_delete_category()
            return await self.async_step_edit_category()
        categories = {
            str(item["id"]): (
                f"{category_label(self._language(), item)} — {interval_label(self._language(), int(item['interval_months']))}"
                + ("" if item.get("enabled", True) else f" — {self._label('disabled')}")
            )
            for item in manager.categories
        }
        return self.async_show_form(
            step_id="manage_category",
            data_schema=vol.Schema(
                {
                    vol.Required("category_id"): vol.In(categories),
                    vol.Required("action", default="edit"): vol.In(
                        {"edit": self._label("edit"), "delete": self._label("delete")}
                    ),
                }
            ),
        )

    async def async_step_edit_category(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        item = manager.category(self._category_id or "")
        if item is None:
            return self.async_abort(reason="category_not_found")
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                await manager.async_update_category(
                    str(item["id"]),
                    name=user_input["name"],
                    interval_months=int(user_input["interval_months"]),
                    enabled=bool(user_input["enabled"]),
                    default_payer_id=(
                        None
                        if user_input.get("default_payer_id") in (None, "", NO_DEFAULT_PAYER)
                        else str(user_input["default_payer_id"])
                    ),
                    color=user_input.get("color"),
                    consumption_unit=user_input.get("consumption_unit", ""),
                    default_provider=user_input.get("default_provider", ""),
                    default_contract=user_input.get("default_contract", ""),
                )
            except ValueError:
                errors["base"] = "invalid_category"
            else:
                self._category_id = None
                return await self.async_step_init()
        return self.async_show_form(
            step_id="edit_category",
            data_schema=self._category_schema(manager, item),
            errors=errors,
        )

    async def async_step_delete_category(self, user_input: dict[str, Any] | None = None):
        manager = self._manager()
        if manager is None:
            return self.async_abort(reason="not_setup")
        item = manager.category(self._category_id or "")
        if item is None:
            return self.async_abort(reason="category_not_found")
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                await manager.async_delete_category(str(item["id"]))
            except ValueError:
                errors["base"] = "category_in_use"
            else:
                self._category_id = None
                return await self.async_step_init()
        return self.async_show_form(
            step_id="delete_category",
            data_schema=vol.Schema({}),
            errors=errors,
            description_placeholders={"name": str(item["name"])},
        )

    async def async_step_support(self, user_input: dict[str, Any] | None = None):
        """Show optional ways to support Billy."""
        if user_input is not None:
            return await self.async_step_init()
        return self.async_show_form(
            step_id="support",
            data_schema=vol.Schema({}),
            description_placeholders={
                "project_url": PROJECT_URL,
                "support_url": SUPPORT_URL,
            },
        )

    async def async_step_done(self, user_input: dict[str, Any] | None = None):
        return self.async_create_entry(title="", data={})

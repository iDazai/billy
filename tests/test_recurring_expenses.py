from __future__ import annotations

import ast
from calendar import monthrange
from datetime import date
from math import isfinite
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / "custom_components" / "bill_tracker" / "manager.py"
INIT = ROOT / "custom_components" / "bill_tracker" / "__init__.py"
PANEL = ROOT / "custom_components" / "bill_tracker" / "frontend" / "billy-panel.js"


def _recurring_helper_class():
    tree = ast.parse(MANAGER.read_text(encoding="utf-8"))
    source_cls = next(
        node for node in tree.body
        if isinstance(node, ast.ClassDef) and node.name == "BillTrackerManager"
    )
    names = {
        "_normalize_optional_iso_date",
        "_normalize_optional_text",
        "_normalize_recurring_payload",
        "_add_months_date",
        "_recurring_occurrence",
        "_next_recurring_due",
        "_recurring_occurrences_between",
        "_recurring_progress",
        "_next_renewal_date",
    }
    methods = [
        node for node in source_cls.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in names
    ]
    cls = ast.ClassDef(
        name="RecurringHarness",
        bases=[],
        keywords=[],
        body=methods,
        decorator_list=[],
    )
    module = ast.Module(body=[cls], type_ignores=[])
    ast.fix_missing_locations(module)
    ns = {
        "Any": object,
        "date": date,
        "monthrange": monthrange,
        "isfinite": isfinite,
        "RECURRING_KINDS": ("subscription", "mortgage", "installment", "recurring"),
        "RECURRING_INTERVALS": (1, 2, 3, 4, 6, 12),
    }
    exec(compile(module, str(MANAGER), "exec"), ns)
    return ns["RecurringHarness"]


def test_recurring_schedule_preserves_anchor_day_and_clips_short_months():
    manager = _recurring_helper_class()()
    item = manager._normalize_recurring_payload(
        name="Service",
        kind="subscription",
        amount=12.99,
        interval_months=1,
        start_date="2026-01-31",
        end_date=None,
        auto_renew=True,
        renewal_interval_months=12,
        installment_count=None,
        provider="",
        contract="",
        note="",
        active=True,
    )
    assert manager._recurring_occurrence(item, 0) == date(2026, 1, 31)
    assert manager._recurring_occurrence(item, 1) == date(2026, 2, 28)
    assert manager._recurring_occurrence(item, 2) == date(2026, 3, 31)


def test_installment_count_calculates_last_due_and_stops_series():
    manager = _recurring_helper_class()()
    item = manager._normalize_recurring_payload(
        name="Phone",
        kind="installment",
        amount=50,
        interval_months=1,
        start_date="2026-01-15",
        end_date=None,
        auto_renew=True,
        renewal_interval_months=12,
        installment_count=3,
        provider="",
        contract="",
        note="",
        active=True,
    )
    assert item["auto_renew"] is False
    assert item["end_date"] == "2026-03-15"
    assert manager._recurring_occurrence(item, 2) == date(2026, 3, 15)
    assert manager._recurring_occurrence(item, 3) is None


def test_auto_renew_expiration_is_a_renewal_marker_not_forecast_stop():
    manager = _recurring_helper_class()()
    item = manager._normalize_recurring_payload(
        name="Annual contract",
        kind="subscription",
        amount=20,
        interval_months=1,
        start_date="2025-06-01",
        end_date="2026-06-01",
        auto_renew=True,
        renewal_interval_months=12,
        installment_count=None,
        provider="",
        contract="",
        note="",
        active=True,
    )
    assert manager._next_recurring_due(item, date(2026, 8, 1)) == date(2026, 8, 1)
    assert manager._next_renewal_date(item, date(2026, 8, 1)) == "2027-06-01"


def test_recurring_expenses_are_in_snapshot_forecast_and_persistence():
    source = MANAGER.read_text(encoding="utf-8")
    for token in (
        'self.recurring_expenses: list[dict[str, Any]] = []',
        '"recurring_expenses": [self._public_recurring_expense(x)',
        '"recurring_total": recurring_total',
        '"recurring_next_month"',
        '"recurring_monthly_equivalent"',
        '"installment_remaining_total"',
        '"recurring_expenses": self.recurring_expenses',
        'def _migrate_recurring_expenses',
    ):
        assert token in source


def test_recurring_websocket_crud_is_registered():
    source = INIT.read_text(encoding="utf-8")
    for token in (
        '"bill_tracker/recurring/add"',
        '"bill_tracker/recurring/update"',
        '"bill_tracker/recurring/set_active"',
        '"bill_tracker/recurring/delete"',
        'ws_recurring_add',
        'ws_recurring_update',
        'ws_recurring_set_active',
        'ws_recurring_delete',
    ):
        assert token in source


def test_sidebar_has_native_recurring_management_and_custom_parser_editor():
    panel = PANEL.read_text(encoding="utf-8")
    parser_panel = (
        ROOT
        / "custom_components"
        / "bill_tracker"
        / "frontend"
        / "billy-parser-manager.js"
    ).read_text(encoding="utf-8")
    for token in (
        "class BillyRecurring",
        '<billy-recurring id="recurring-panel">',
        'data-view="recurring"',
        "bill_tracker/recurring/add",
        "bill_tracker/recurring/update",
        "bill_tracker/recurring/set_active",
        "bill_tracker/recurring/delete",
        "recurringOverview",
        "recurring_monthly_equivalent",
    ):
        assert token in panel
    for token in (
        'id="new-custom"',
        "bill_tracker/parser/custom/save",
        "bill_tracker/parser/custom/export",
        "bill_tracker/parser/test",
    ):
        assert token in parser_panel

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "bill_tracker" / "frontend"


def test_frontend_is_based_on_0_5_2_ui():
    js = (FRONTEND / "bill-tracker-card-impl.js").read_text(encoding="utf-8")
    for token in (
        "_chart ()",
        "toggle-current-bills",
        "open-all-bills",
        "all-bills-modal",
        "all-bills-category",
        "all-bills-status",
        "all-bills-time-mode",
        "all-bills-year",
        "all-bills-from",
        "all-bills-to",
        "all-bills-page-size",
        "transfer-modal",
        "import-create-categories",
        "import-create-payers",
        "export-format",
        "export-status",
        "export-category",
        "export-trend",
        'class="paypal"',
        "pay_with_paypal",
    ):
        assert token in js


def test_frontend_and_manifest_use_rewrite_version():
    bootstrap = (FRONTEND / "bill-tracker-card.js").read_text(encoding="utf-8")
    implementation = (FRONTEND / "bill-tracker-card-impl.js").read_text(encoding="utf-8")
    manifest = (ROOT / "custom_components" / "bill_tracker" / "manifest.json").read_text(encoding="utf-8")
    assert "BILLY_FRONTEND_VERSION = '0.9.1'" in bootstrap
    assert "BILL_TRACKER_VERSION = '0.9.1'" in implementation
    assert "./bill-tracker-i18n.js?v=0.9.1" in implementation
    assert '"version": "0.9.1"' in manifest


def test_automatic_parsing_does_not_replace_lovelace_ui():
    sensor = (ROOT / "custom_components" / "bill_tracker" / "sensor.py").read_text(encoding="utf-8")
    parser_manager = (ROOT / "custom_components" / "bill_tracker" / "parser" / "manager.py").read_text(encoding="utf-8")
    assert "ParserManager" in sensor
    assert "imap_content" in parser_manager


def test_parser_manager_panel_is_scalable_and_has_bill_type_filter():
    panel = (FRONTEND / "billy-parser-manager.js").read_text(encoding="utf-8")
    flow = (ROOT / "custom_components" / "bill_tracker" / "config_flow.py").read_text(encoding="utf-8")
    for token in (
        'id="search"',
        'id="country"',
        'id="bill-type"',
        'id="status"',
        'id="sort"',
        "this._billType !== 'all'",
        "bill_tracker/parser/refresh",
        "bill_tracker/parser/install",
        "bill_tracker/parser/uninstall",
        "update_available",
        "outdated",
    ):
        assert token in panel
    assert '"parser_manager"' in flow
    assert '"/billy?view=parsers"' in flow


def test_parser_search_does_not_rebuild_input_on_every_keystroke():
    panel = (FRONTEND / "billy-parser-manager.js").read_text(encoding="utf-8")
    handler_start = panel.index("getElementById('search')?.addEventListener('input'")
    handler_end = panel.index("getElementById('country')?.addEventListener", handler_start)
    handler = panel[handler_start:handler_end]
    assert "this._renderList()" in handler
    assert "this._render()" not in handler
    assert "resets the caret to position 0" in handler


def test_billy_sidebar_panel_keeps_card_and_parser_manager():
    panel = (FRONTEND / "billy-panel.js").read_text(encoding="utf-8")
    init = (ROOT / "custom_components" / "bill_tracker" / "__init__.py").read_text(encoding="utf-8")
    for token in (
        "billy-parser-manager.js?v=0.9.1",
        '<billy-dashboard id="dashboard">',
        '<billy-bills id="bills-panel">',
        '<billy-parser-manager id="parser-manager">',
        '<billy-settings id="settings-panel">',
        "customElements.define('billy-panel'",
    ):
        assert token in panel
    assert 'frontend_url_path=BILLY_PANEL_ROUTE' in init
    assert 'webcomponent_name="billy-panel"' in init
    assert 'sidebar_title="Billy"' in init
    assert 'sidebar_icon="mdi:receipt-text-outline"' in init
    assert 'require_admin=False' in init


def test_billy_panel_uses_home_assistant_custom_panel_loader():
    init = (ROOT / "custom_components" / "bill_tracker" / "__init__.py").read_text(encoding="utf-8")
    assert "from homeassistant.components.panel_custom import async_register_panel" in init
    assert "await async_register_panel(" in init
    assert "async_remove_panel(hass, BILLY_PANEL_ROUTE" in init
    assert 'module_url=BILLY_PANEL_MODULE_URL' in init


def test_lovelace_resource_url_is_not_versioned():
    init = (ROOT / "custom_components" / "bill_tracker" / "__init__.py").read_text(encoding="utf-8")
    assert 'FRONTEND_MODULE_URL = FRONTEND_URL' in init
    assert 'FRONTEND_MODULE_URL = f"{FRONTEND_URL}?v=' not in init


def test_billy_panel_has_large_dashboard_and_native_settings():
    panel = (FRONTEND / "billy-panel.js").read_text(encoding="utf-8")
    for token in (
        "class BillyDashboard",
        "spendingTrend",
        "categoryBreakdown",
        "upcomingBills",
        "recentBills",
        "class BillySettings",
        "bill_tracker/category/add",
        "bill_tracker/category/update",
        "bill_tracker/category/delete",
        "bill_tracker/payer/add",
        "bill_tracker/payer/update",
        "bill_tracker/payer/delete",
        "bill_tracker/parser/sources/set",
        "class BillyBills",
        "bill_tracker/add",
        "bill_tracker/update",
        "bill_tracker/delete",
        "bill_tracker/set_paid",
        "Rimborsi tra utenti",
        "confirmReimbursement",
        "developerCredits",
        "https://github.com/robin994/billy-parser",
        "https://www.linkedin.com/in/roberto-tortora-379928109/",
        "https://paypal.me/rtortora94",
    ):
        assert token in panel
    assert '<bill-tracker-card id="dashboard-card">' not in panel
    assert '<billy-bills id="bills-panel">' in panel


def test_bills_page_filters_and_flags_user_reimbursements():
    panel = (FRONTEND / "billy-panel.js").read_text(encoding="utf-8")
    init = (ROOT / "custom_components" / "bill_tracker" / "__init__.py").read_text(encoding="utf-8")
    manager = (ROOT / "custom_components" / "bill_tracker" / "manager.py").read_text(encoding="utf-8")
    for token in (
        'id="bill-reimbursement"',
        "this._reimbursement === 'pending'",
        "this._reimbursement === 'done'",
        "data-reimbursed-id",
        "bill_tracker/set_reimbursement",
        "reimbursementPartial",
        "reimbursement_can_toggle",
    ):
        assert token in panel
    assert '"bill_tracker/set_reimbursement"' in init
    assert "async_set_reimbursement_done" in manager
    assert '"reimbursement_status": reimbursement["status"]' in manager

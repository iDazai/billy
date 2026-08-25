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
    assert "BILLY_FRONTEND_VERSION = '0.6.6'" in bootstrap
    assert "BILL_TRACKER_VERSION = '0.6.6'" in implementation
    assert "./bill-tracker-i18n.js?v=0.6.6" in implementation
    assert '"version": "0.6.6"' in manifest


def test_automatic_parsing_does_not_replace_lovelace_ui():
    sensor = (ROOT / "custom_components" / "bill_tracker" / "sensor.py").read_text(encoding="utf-8")
    parser_manager = (ROOT / "custom_components" / "bill_tracker" / "parser" / "manager.py").read_text(encoding="utf-8")
    assert "ParserManager" in sensor
    assert "imap_content" in parser_manager


def test_parser_manager_panel_is_registered_and_scalable():
    panel = (FRONTEND / "billy-parser-manager.js").read_text(encoding="utf-8")
    init = (ROOT / "custom_components" / "bill_tracker" / "__init__.py").read_text(encoding="utf-8")
    flow = (ROOT / "custom_components" / "bill_tracker" / "config_flow.py").read_text(encoding="utf-8")
    for token in (
        "id=\"search\"",
        "id=\"country\"",
        "id=\"status\"",
        "id=\"sort\"",
        "bill_tracker/parser/refresh",
        "bill_tracker/parser/install",
        "bill_tracker/parser/uninstall",
        "update_available",
        "outdated",
    ):
        assert token in panel
    assert '"billy-parser-manager"' in init
    assert 'show_in_sidebar=False' in init
    assert '"parser_manager"' in flow



def test_parser_panel_uses_home_assistant_custom_panel_loader():
    init = (ROOT / "custom_components" / "bill_tracker" / "__init__.py").read_text(encoding="utf-8")
    assert 'async_register_built_in_panel(' in init
    assert '\n        "custom",' in init
    assert '"_panel_custom": {' in init
    assert '"name": "billy-parser-manager"' in init
    assert '"module_url": PARSER_MANAGER_MODULE_URL' in init
    assert 'update=async_panel_exists(hass, PARSER_MANAGER_PANEL_PATH)' in init


def test_lovelace_resource_url_is_not_versioned():
    init = (ROOT / "custom_components" / "bill_tracker" / "__init__.py").read_text(encoding="utf-8")
    assert 'FRONTEND_MODULE_URL = FRONTEND_URL' in init
    assert 'FRONTEND_MODULE_URL = f"{FRONTEND_URL}?v=' not in init

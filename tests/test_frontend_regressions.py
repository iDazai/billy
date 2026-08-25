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
    assert "BILLY_FRONTEND_VERSION = '0.6.2'" in bootstrap
    assert "BILL_TRACKER_VERSION = '0.6.2'" in implementation
    assert "./bill-tracker-i18n.js?v=0.6.2" in implementation
    assert '"version": "0.6.2"' in manifest


def test_automatic_parsing_does_not_replace_lovelace_ui():
    sensor = (ROOT / "custom_components" / "bill_tracker" / "sensor.py").read_text(encoding="utf-8")
    parser_manager = (ROOT / "custom_components" / "bill_tracker" / "parser" / "manager.py").read_text(encoding="utf-8")
    assert "ParserManager" in sensor
    assert "imap_content" in parser_manager

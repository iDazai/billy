from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "bill_tracker" / "frontend"


def test_frontend_keeps_history_filters_and_paypal_action():
    js = (FRONTEND / "bill-tracker-card-impl.js").read_text(encoding="utf-8")
    for token in (
        "bill-filter-category",
        "bill-filter-status",
        "bill-filter-time-mode",
        "bill-filter-year",
        "bill-filter-from",
        "bill-filter-to",
        "bill-page-size",
        "class=\"paypal small\"",
        "pay_with_paypal",
    ):
        assert token in js


def test_frontend_and_manifest_are_hotfix_version():
    bootstrap = (FRONTEND / "bill-tracker-card.js").read_text(encoding="utf-8")
    implementation = (FRONTEND / "bill-tracker-card-impl.js").read_text(encoding="utf-8")
    manifest = (ROOT / "custom_components" / "bill_tracker" / "manifest.json").read_text(encoding="utf-8")
    assert "BILLY_FRONTEND_VERSION = '0.6.1'" in bootstrap
    assert "BILL_TRACKER_VERSION = '0.6.1'" in implementation
    assert '"version": "0.6.1"' in manifest

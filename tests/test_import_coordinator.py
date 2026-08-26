from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "custom_components" / "bill_tracker"))

from importers.coordinator import BillImportCoordinator  # noqa: E402


def test_anchor_prefers_billing_period_over_due_date():
    anchor = BillImportCoordinator._anchor_date(
        {
            "period_end": "2026-07-31",
            "issue_date": "2026-07-16",
            "due_date": "2026-08-08",
        }
    )
    assert anchor.isoformat() == "2026-07-31"


def test_anchor_prefers_issue_date_when_period_is_missing():
    anchor = BillImportCoordinator._anchor_date(
        {
            "issue_date": "2026-07-16",
            "due_date": "2026-08-08",
        }
    )
    assert anchor.isoformat() == "2026-07-16"

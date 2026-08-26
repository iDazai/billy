from collections import defaultdict
from pathlib import Path
import ast
from types import MethodType

ROOT = Path(__file__).resolve().parents[1]
MANAGER = ROOT / "custom_components" / "bill_tracker" / "manager.py"


def _load_pairwise_debts():
    tree = ast.parse(MANAGER.read_text(encoding="utf-8"))
    cls = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "BillTrackerManager")
    fn = next(node for node in cls.body if isinstance(node, ast.FunctionDef) and node.name == "_pairwise_debts")
    module = ast.Module(body=[fn], type_ignores=[])
    ast.fix_missing_locations(module)
    ns = {"Any": object, "defaultdict": defaultdict}
    exec(compile(module, str(MANAGER), "exec"), ns)
    return ns["_pairwise_debts"]


class DummyManager:
    def __init__(self):
        self.payers = [
            {"id": "a", "name": "A", "paypal_me": "payerA"},
            {"id": "b", "name": "B", "paypal_me": "payerB"},
        ]
        self.expenses = []
        self.recurring_occurrences = []
        self.settlements = []
        self.currency = "EUR"

    def payer(self, payer_id):
        return next((row for row in self.payers if row["id"] == payer_id), None)

    @staticmethod
    def _paypal_url(handle, amount, currency):
        return f"https://paypal.me/{handle}/{amount:.2f}{currency}" if handle else ""

    def _sync_recurring_occurrences(self):
        return False


def test_reimbursements_are_independent_from_provider_bill_payment():
    manager = DummyManager()
    manager._pairwise_debts = MethodType(_load_pairwise_debts(), manager)
    manager.expenses = [
        {
            "id": "bill-1",
            "payer_id": "a",
            "amount": 100.0,
            "paid": True,
            "split": [
                {"payer_id": "a", "percentage": 50.0},
                {"payer_id": "b", "percentage": 50.0},
            ],
        }
    ]
    debts = manager._pairwise_debts()
    assert len(debts) == 1
    assert debts[0]["from_payer_id"] == "b"
    assert debts[0]["to_payer_id"] == "a"
    assert debts[0]["amount"] == 50.0

    manager.settlements = [
        {"from_payer_id": "b", "to_payer_id": "a", "amount": 50.0}
    ]
    assert manager._pairwise_debts() == []
    assert manager.expenses[0]["paid"] is True


def test_settlement_methods_do_not_mutate_bill_paid_status():
    source = MANAGER.read_text(encoding="utf-8")
    start = source.index("    async def async_add_settlement(")
    end = source.index("    def _pairwise_debts", start)
    settlement_source = source[start:end]
    assert 'expense["paid"]' not in settlement_source
    assert "without touching bill status" in settlement_source
    assert "Bill payment and payer reimbursements are deliberately independent" in settlement_source


def test_manual_bill_reimbursement_flag_removes_it_from_open_debts():
    manager = DummyManager()
    manager._pairwise_debts = MethodType(_load_pairwise_debts(), manager)
    manager.expenses = [
        {
            "id": "bill-manual",
            "payer_id": "a",
            "amount": 100.0,
            "paid": False,
            "reimbursement_manual_done": True,
            "split": [
                {"payer_id": "a", "percentage": 50.0},
                {"payer_id": "b", "percentage": 50.0},
            ],
        }
    ]
    assert manager._pairwise_debts() == []
    assert manager.expenses[0]["paid"] is False


def test_due_recurring_occurrence_uses_the_same_split_debt_logic():
    manager = DummyManager()
    manager._pairwise_debts = MethodType(_load_pairwise_debts(), manager)
    manager.recurring_occurrences = [
        {
            "id": "rec-1@2026-08-15",
            "recurring_id": "rec-1",
            "payer_id": "a",
            "amount": 40.0,
            "split": [
                {"payer_id": "a", "percentage": 50.0},
                {"payer_id": "b", "percentage": 50.0},
            ],
            "reimbursement_manual_done": False,
        }
    ]
    debts = manager._pairwise_debts()
    assert len(debts) == 1
    assert debts[0]["from_payer_id"] == "b"
    assert debts[0]["to_payer_id"] == "a"
    assert debts[0]["amount"] == 20.0
    assert debts[0]["recurring_count"] == 1
    assert debts[0]["item_count"] == 1
    assert debts[0]["recurring_occurrence_ids"] == ["rec-1@2026-08-15"]

    manager.recurring_occurrences[0]["reimbursement_manual_done"] = True
    assert manager._pairwise_debts() == []


def test_manual_reimbursement_state_is_migrated_and_kept_separate_from_paid():
    source = MANAGER.read_text(encoding="utf-8")
    assert '"reimbursement_manual_done": bool(item.get("reimbursement_manual_done", False))' in source
    assert '"reimbursement_manual_at"' in source
    assert 'if bool(item.get("reimbursement_manual_done", False)):' in source
    assert 'item["paid"]' not in source[source.index("    async def async_set_reimbursement_done("):source.index("    async def async_delete(")]

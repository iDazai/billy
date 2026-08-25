"""Small backend localization helpers used by config flows and exports."""
from __future__ import annotations

from typing import Any

SUPPORTED_LANGUAGES = {"en", "it", "de", "es", "fr", "pt"}

_CONFIG = {
    "en": {
        "share": "share",
        "disabled": "disabled",
        "edit": "Edit",
        "delete": "Delete",
        "none": "None",
    },
    "it": {
        "share": "quota",
        "disabled": "disattivato",
        "edit": "Modifica",
        "delete": "Elimina",
        "none": "Nessuno",
    },
    "de": {"share": "Anteil", "disabled": "deaktiviert", "edit": "Bearbeiten", "delete": "Löschen", "none": "Keine"},
    "es": {"share": "cuota", "disabled": "desactivado", "edit": "Editar", "delete": "Eliminar", "none": "Ninguno"},
    "fr": {"share": "part", "disabled": "désactivé", "edit": "Modifier", "delete": "Supprimer", "none": "Aucun"},
    "pt": {"share": "quota", "disabled": "desativado", "edit": "Editar", "delete": "Eliminar", "none": "Nenhum"},
}

_INTERVALS = {
    "en": {1: "Monthly", 2: "Every 2 months", 3: "Quarterly", 4: "Every 4 months", 6: "Every 6 months", 12: "Yearly"},
    "it": {1: "Mensile", 2: "Bimestrale", 3: "Trimestrale", 4: "Quadrimestrale", 6: "Semestrale", 12: "Annuale"},
    "de": {1: "Monatlich", 2: "Alle 2 Monate", 3: "Vierteljährlich", 4: "Alle 4 Monate", 6: "Halbjährlich", 12: "Jährlich"},
    "es": {1: "Mensual", 2: "Cada 2 meses", 3: "Trimestral", 4: "Cada 4 meses", 6: "Semestral", 12: "Anual"},
    "fr": {1: "Mensuel", 2: "Tous les 2 mois", 3: "Trimestriel", 4: "Tous les 4 mois", 6: "Semestriel", 12: "Annuel"},
    "pt": {1: "Mensal", 2: "A cada 2 meses", 3: "Trimestral", 4: "A cada 4 meses", 6: "Semestral", 12: "Anual"},
}

_CATEGORY_NAMES = {
    "en": {
        "internet": "Internet",
        "electricity": "Electricity",
        "water": "Water",
        "gas": "Gas",
        "condominium": "Condominium",
        "phone": "Phone",
        "tari": "Waste / TARI",
        "other": "Other",
    },
    "it": {
        "internet": "Internet",
        "electricity": "Elettricità",
        "water": "Acqua",
        "gas": "Gas",
        "condominium": "Condominio",
        "phone": "Telefono",
        "tari": "TARI / Rifiuti",
        "other": "Altro",
    },
    "de": {"internet": "Internet", "electricity": "Strom", "water": "Wasser", "gas": "Gas", "condominium": "Hausverwaltung", "phone": "Telefon", "tari": "Abfall", "other": "Andere"},
    "es": {"internet": "Internet", "electricity": "Electricidad", "water": "Agua", "gas": "Gas", "condominium": "Comunidad", "phone": "Teléfono", "tari": "Residuos", "other": "Otro"},
    "fr": {"internet": "Internet", "electricity": "Électricité", "water": "Eau", "gas": "Gaz", "condominium": "Copropriété", "phone": "Téléphone", "tari": "Déchets", "other": "Autre"},
    "pt": {"internet": "Internet", "electricity": "Eletricidade", "water": "Água", "gas": "Gás", "condominium": "Condomínio", "phone": "Telefone", "tari": "Resíduos", "other": "Outro"},
}

_REPORT = {
    "en": {"title": "Billy - Bills report", "all_history": "All history", "paid": "Paid", "unpaid": "Unpaid", "total": "Total"},
    "it": {"title": "Billy - Report bollette", "all_history": "Tutto lo storico", "paid": "Pagata", "unpaid": "Da pagare", "total": "Totale"},
    "de": {"title": "Billy - Rechnungsbericht", "all_history": "Gesamter Verlauf", "paid": "Bezahlt", "unpaid": "Offen", "total": "Gesamt"},
    "es": {"title": "Billy - Informe de facturas", "all_history": "Todo el historial", "paid": "Pagada", "unpaid": "Pendiente", "total": "Total"},
    "fr": {"title": "Billy - Rapport de factures", "all_history": "Tout l'historique", "paid": "Payée", "unpaid": "À payer", "total": "Total"},
    "pt": {"title": "Billy - Relatório de contas", "all_history": "Todo o histórico", "paid": "Paga", "unpaid": "Pendente", "total": "Total"},
}


def normalize_language(language: str | None) -> str:
    value = str(language or "en").strip().replace("_", "-").split("-", 1)[0].casefold()
    return value if value in SUPPORTED_LANGUAGES else "en"


def config_label(language: str | None, key: str) -> str:
    lang = normalize_language(language)
    return _CONFIG.get(lang, _CONFIG["en"]).get(key, _CONFIG["en"].get(key, key))


def interval_label(language: str | None, months: int) -> str:
    lang = normalize_language(language)
    count = int(months)
    return _INTERVALS.get(lang, _INTERVALS["en"]).get(count, f"{count} months")


def category_label(language: str | None, category: dict[str, Any] | None) -> str:
    if not category:
        return ""
    category_id = str(category.get("id") or "")
    fallback = str(category.get("name") or category_id)
    lang = normalize_language(language)
    return _CATEGORY_NAMES.get(lang, _CATEGORY_NAMES["en"]).get(category_id, fallback)


def report_labels(language: str | None) -> dict[str, str]:
    lang = normalize_language(language)
    return dict(_REPORT.get(lang, _REPORT["en"]))

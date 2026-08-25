"""CSV/XLSX/PDF import-export helpers for Billy.

The writers intentionally use only the Python standard library so the integration
stays lightweight inside Home Assistant.
"""
from __future__ import annotations

import csv
import io
import math
import zipfile
from datetime import datetime
from html import escape as xml_escape
from typing import Any, Iterable

from .localization import category_label, report_labels

CSV_HEADERS = [
    "id",
    "category",
    "interval_months",
    "amount",
    "currency",
    "provider",
    "contract",
    "consumption",
    "consumption_unit",
    "billing_month",
    "paid",
    "payment_date",
    "due_date",
    "period_start",
    "period_end",
    "payer",
    "split",
    "note",
]

_ALIASES = {
    "id": ("id",),
    "category": ("category", "categoria", "tipo", "bill_type"),
    "interval_months": ("interval_months", "interval", "frequenza", "periodicita", "periodicità"),
    "amount": ("amount", "importo", "totale"),
    "currency": ("currency", "valuta"),
    "provider": ("provider", "fornitore", "compagnia"),
    "contract": ("contract", "contratto", "offerta", "plan"),
    "consumption": ("consumption", "consumo"),
    "consumption_unit": ("consumption_unit", "unita_consumo", "unità_consumo", "unit"),
    "billing_month": ("billing_month", "mese_pagamento", "mese", "month"),
    "year": ("year", "anno"),
    "month": ("month", "mese_numero"),
    "paid": ("paid", "pagata", "pagato"),
    "payment_date": ("payment_date", "data_pagamento", "data_addebito"),
    "due_date": ("due_date", "scadenza", "data_scadenza"),
    "period_start": ("period_start", "competenza_da", "periodo_inizio"),
    "period_end": ("period_end", "competenza_a", "periodo_fine"),
    "payer": ("payer", "pagante", "pagatore"),
    "split": ("split", "divisione", "quote"),
    "note": ("note", "nota", "notes"),
}


def month_key(year: int, month: int) -> str:
    return f"{int(year):04d}-{int(month):02d}"


def month_tuple(value: str | None) -> tuple[int, int] | None:
    text = str(value or "").strip()
    if not text:
        return None
    parts = text.split("-")
    if len(parts) != 2:
        raise ValueError(f"Mese non valido: {text}. Usa YYYY-MM")
    try:
        year, month = int(parts[0]), int(parts[1])
    except ValueError as err:
        raise ValueError(f"Mese non valido: {text}. Usa YYYY-MM") from err
    if year < 2000 or year > 2200 or month < 1 or month > 12:
        raise ValueError(f"Mese non valido: {text}. Usa YYYY-MM")
    return year, month


def parse_csv_amount(value: Any) -> float:
    text = str(value or "").strip().replace("\u00a0", "").replace("€", "")
    if not text:
        raise ValueError("importo mancante")
    # Accept both 1.234,56 and 1,234.56, preferring the rightmost separator as decimal.
    if "," in text and "." in text:
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        amount = float(text)
    except ValueError as err:
        raise ValueError(f"importo non valido: {value}") from err
    if not math.isfinite(amount) or amount < 0:
        raise ValueError(f"importo non valido: {value}")
    return amount


def parse_csv_bool(value: Any) -> bool:
    text = str(value or "").strip().casefold()
    if text in {"1", "true", "yes", "y", "si", "sì", "pagata", "pagato"}:
        return True
    if text in {"", "0", "false", "no", "n", "non pagata", "non pagato", "unpaid"}:
        return False
    raise ValueError(f"stato pagamento non valido: {value}")


def _normalize_header(value: str) -> str:
    return str(value or "").strip().casefold().replace(" ", "_")


def parse_csv_records(csv_text: str) -> list[tuple[int, dict[str, str]]]:
    text = str(csv_text or "")
    if not text.strip():
        raise ValueError("CSV vuoto")
    if len(text.encode("utf-8")) > 5_000_000:
        raise ValueError("CSV troppo grande")
    sample = text[:8192]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
    except csv.Error:
        dialect = csv.excel
    reader = csv.DictReader(io.StringIO(text), dialect=dialect)
    if not reader.fieldnames:
        raise ValueError("Intestazione CSV mancante")

    normalized_names = {_normalize_header(name): name for name in reader.fieldnames if name is not None}
    mapping: dict[str, str] = {}
    for canonical, aliases in _ALIASES.items():
        for alias in aliases:
            original = normalized_names.get(_normalize_header(alias))
            if original is not None:
                mapping[canonical] = original
                break
    if "category" not in mapping or "amount" not in mapping:
        raise ValueError("Il CSV deve contenere almeno le colonne category/categoria e amount/importo")

    result: list[tuple[int, dict[str, str]]] = []
    for line_no, raw in enumerate(reader, start=2):
        if not any(str(value or "").strip() for value in raw.values()):
            continue
        row = {canonical: str(raw.get(original) or "").strip() for canonical, original in mapping.items()}
        result.append((line_no, row))
    return result


def iter_months(start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]]:
    result: list[tuple[int, int]] = []
    year, month = start
    while (year, month) <= end:
        result.append((year, month))
        if month == 12:
            year, month = year + 1, 1
        else:
            month += 1
    return result


def filter_expenses(
    expenses: Iterable[dict[str, Any]],
    *,
    from_month: str | None = None,
    to_month: str | None = None,
    status: str = "all",
    category_id: str | None = None,
) -> list[dict[str, Any]]:
    start = month_tuple(from_month)
    end = month_tuple(to_month)
    if start and end and start > end:
        start, end = end, start
    wanted_status = status if status in {"all", "paid", "unpaid"} else "all"
    wanted_category = str(category_id or "")
    rows: list[dict[str, Any]] = []
    for item in expenses:
        key = (int(item.get("paid_year", item.get("year", 0))), int(item.get("paid_month", item.get("month", 0))))
        if start and key < start:
            continue
        if end and key > end:
            continue
        if wanted_category and wanted_category != "all" and str(item.get("category_id", "")) != wanted_category:
            continue
        paid = bool(item.get("paid", False))
        if wanted_status == "paid" and not paid:
            continue
        if wanted_status == "unpaid" and paid:
            continue
        rows.append(dict(item))
    rows.sort(
        key=lambda x: (
            int(x.get("paid_year", x.get("year", 0))),
            int(x.get("paid_month", x.get("month", 0))),
            str(x.get("created_at", "")),
        ),
        reverse=True,
    )
    return rows


def _split_text(item: dict[str, Any]) -> str:
    parts = []
    for part in item.get("split", []) or []:
        name = str(part.get("name") or part.get("payer_id") or "").strip()
        if name:
            parts.append(f"{name}:{float(part.get('percentage', 0) or 0):g}")
    return "|".join(parts)


def expense_to_export_row(
    item: dict[str, Any],
    category: dict[str, Any] | None = None,
    *,
    currency: str = "EUR",
) -> dict[str, Any]:
    interval = int((category or {}).get("interval_months", item.get("interval_months", 1)) or 1)
    consumption = item.get("consumption")
    return {
        "id": str(item.get("id", "")),
        "category": str(item.get("category") or (category or {}).get("name") or ""),
        "interval_months": interval,
        "amount": f"{float(item.get('amount', 0) or 0):.2f}",
        "currency": str(item.get("currency") or currency),
        "provider": str(item.get("provider") or ""),
        "contract": str(item.get("contract") or ""),
        "consumption": "" if consumption is None else f"{float(consumption):.4f}".rstrip("0").rstrip("."),
        "consumption_unit": str(item.get("consumption_unit") or (category or {}).get("consumption_unit") or ""),
        "billing_month": month_key(int(item.get("paid_year", item.get("year", 0))), int(item.get("paid_month", item.get("month", 0)))),
        "paid": "true" if bool(item.get("paid", False)) else "false",
        "payment_date": str(item.get("payment_date") or ""),
        "due_date": str(item.get("due_date") or ""),
        "period_start": month_key(int(item.get("period_start_year", 0)), int(item.get("period_start_month", 0))),
        "period_end": month_key(int(item.get("period_end_year", 0)), int(item.get("period_end_month", 0))),
        "payer": str(item.get("payer") or ""),
        "split": _split_text(item),
        "note": str(item.get("note") or ""),
    }


def csv_bytes(
    expenses: Iterable[dict[str, Any]],
    category_lookup: dict[str, dict[str, Any]],
    *,
    currency: str = "EUR",
) -> bytes:
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=CSV_HEADERS, extrasaction="ignore")
    writer.writeheader()
    for item in expenses:
        category = category_lookup.get(str(item.get("category_id", "")))
        writer.writerow(expense_to_export_row(item, category, currency=currency))
    return ("\ufeff" + output.getvalue()).encode("utf-8")


def csv_template_bytes() -> bytes:
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=CSV_HEADERS)
    writer.writeheader()
    writer.writerow(
        {
            "category": "Electricity",
            "interval_months": "1",
            "amount": "84.73",
            "currency": "EUR",
            "provider": "Example Energy",
            "contract": "Example Plan",
            "consumption": "421",
            "consumption_unit": "kWh",
            "billing_month": datetime.now().strftime("%Y-%m"),
            "paid": "false",
            "due_date": datetime.now().strftime("%Y-%m-%d"),
            "period_start": datetime.now().strftime("%Y-%m"),
            "period_end": datetime.now().strftime("%Y-%m"),
            "note": "Example row - remove before importing",
        }
    )
    return ("\ufeff" + output.getvalue()).encode("utf-8")


def _xlsx_cell(ref: str, value: Any, *, header: bool = False) -> str:
    style = ' s="1"' if header else ""
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return f'<c r="{ref}"{style}><v>{value}</v></c>'
    return f'<c r="{ref}" t="inlineStr"{style}><is><t>{xml_escape(str(value or ""))}</t></is></c>'


def _column_name(index: int) -> str:
    result = ""
    index += 1
    while index:
        index, remainder = divmod(index - 1, 26)
        result = chr(65 + remainder) + result
    return result


def xlsx_bytes(
    expenses: Iterable[dict[str, Any]],
    category_lookup: dict[str, dict[str, Any]],
    *,
    from_month: str | None = None,
    to_month: str | None = None,
    currency: str = "EUR",
    language: str = "en",
) -> bytes:
    rows = [CSV_HEADERS]
    for item in expenses:
        row = expense_to_export_row(item, category_lookup.get(str(item.get("category_id", ""))), currency=currency)
        rows.append([row.get(header, "") for header in CSV_HEADERS])

    sheet_rows = []
    for r_index, row in enumerate(rows, start=1):
        cells = "".join(
            _xlsx_cell(f"{_column_name(c_index)}{r_index}", value, header=r_index == 1)
            for c_index, value in enumerate(row)
        )
        sheet_rows.append(f'<row r="{r_index}">{cells}</row>')
    sheet = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
        f'<sheetData>{"".join(sheet_rows)}</sheetData>'
        '<autoFilter ref="A1:R1"/>'
        '</worksheet>'
    )
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>'''
    root_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''
    workbook = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Billy" sheetId="1" r:id="rId1"/></sheets></workbook>'''
    workbook_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''
    styles = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
<borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs>
<cellXfs count="2"><xf fontId="0" fillId="0" borderId="0"/><xf fontId="1" fillId="0" borderId="0" applyFont="1"/></cellXfs>
</styleSheet>'''
    data = io.BytesIO()
    with zipfile.ZipFile(data, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", root_rels)
        zf.writestr("xl/workbook.xml", workbook)
        zf.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        zf.writestr("xl/styles.xml", styles)
        zf.writestr("xl/worksheets/sheet1.xml", sheet)
    return data.getvalue()


def _pdf_escape(text: str) -> str:
    return str(text).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def _simple_pdf(lines: list[str]) -> bytes:
    # Minimal PDF with built-in Helvetica. Unicode outside latin-1 is replaced.
    safe = [line.encode("latin-1", "replace").decode("latin-1") for line in lines]
    content = ["BT", "/F1 10 Tf", "40 800 Td", "12 TL"]
    for line in safe[:58]:
        content.append(f"({_pdf_escape(line)}) Tj")
        content.append("T*")
    content.append("ET")
    stream = "\n".join(content).encode("latin-1")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    out = io.BytesIO()
    out.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(out.tell())
        out.write(f"{index} 0 obj\n".encode())
        out.write(obj)
        out.write(b"\nendobj\n")
    xref = out.tell()
    out.write(f"xref\n0 {len(objects)+1}\n".encode())
    out.write(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        out.write(f"{offset:010d} 00000 n \n".encode())
    out.write(
        f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
    )
    return out.getvalue()


def pdf_bytes(
    expenses: Iterable[dict[str, Any]],
    category_lookup: dict[str, dict[str, Any]],
    *,
    from_month: str | None = None,
    to_month: str | None = None,
    trend: str = "both",
    currency: str = "EUR",
    language: str = "en",
) -> bytes:
    labels = report_labels(language)
    rows = list(expenses)
    title = labels.get("title", "Billy - Bills report")
    range_text = " - ".join(x for x in (from_month, to_month) if x) or labels.get("all_history", "All history")
    lines = [title, range_text, ""]
    total = 0.0
    for item in rows:
        amount = float(item.get("amount", 0) or 0)
        total += amount
        category = category_lookup.get(str(item.get("category_id", "")))
        cat_name = category_label(language, category or {"name": item.get("category", "")})
        period = month_key(int(item.get("paid_year", item.get("year", 0))), int(item.get("paid_month", item.get("month", 0))))
        status = labels.get("paid", "Paid") if item.get("paid") else labels.get("unpaid", "Unpaid")
        lines.append(f"{period}  {cat_name}  {amount:.2f} {currency}  {status}")
        details = " · ".join(x for x in [str(item.get("provider") or ""), str(item.get("contract") or ""), str(item.get("note") or "")] if x)
        if details:
            lines.append(f"  {details}")
    lines.extend(["", f"{labels.get('total', 'Total')}: {total:.2f} {currency}"])
    return _simple_pdf(lines)

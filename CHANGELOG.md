# Changelog

## 0.5.2
-  hotfix language 

## 0.5.1

### Localization

- Added **English, Italian, Spanish, French, German and Portuguese** localization.
- The Lovelace card and visual editor now automatically follow the language selected in Home Assistant, with English fallback for unsupported languages.
- Localized bill forms, filters, status labels, import/export UI, savings views, recurrence labels and built-in bill type names.
- Localized Home Assistant config/options flows and the Billy sensor entity name.
- Generated Excel and PDF reports now use the selected Home Assistant language.
- User-created bill types, payer names, providers, contracts and notes remain untouched and are never translated.

### Support

- Added an optional **Support Billy** entry to the native Home Assistant integration settings.
- Provides direct links to star the project on GitHub or buy the developer a coffee through PayPal.Me.
- Support links are informational only and never interrupt normal Billy usage.

## 0.5.0

### Consumption, contracts and savings

- Added optional **provider/company**, **contract/plan** and **consumption** fields to each bill.
- Bill types can define a consumption unit plus a default provider/company and contract/plan; built-in Electricity uses `kWh`, Gas and Water use `m³`, and custom units are supported. New bills inherit these defaults while historical bills keep their original provider/contract.
- Added a **provider/contract savings** panel that detects the latest contract change per bill type and compares weighted cost per unit before/after the change.
- Savings are normalized to the new period's actual consumption, so Billy distinguishes tariff savings from changes caused only by using less/more energy or water.
- Added provider, contract, consumption and consumption unit to CSV/XLSX round-trip exports/imports.
- Storage schema upgraded to v8 with automatic migration of existing bills/categories.

### Currency

- Removed the hard-coded EUR assumption from the Lovelace card and monetary sensor.
- Billy now uses Home Assistant's configured currency for totals, forecasts, PayPal.Me amounts and CSV/XLSX/PDF exports.
- CSV imports with an explicit currency different from the Home Assistant currency are rejected to avoid silently aggregating incompatible amounts.

### Import / Export

- Added a dedicated **Import / Export** dialog to the Billy dashboard card.
- CSV import supports Billy exports plus common English/Italian column aliases.
- Re-importing rows with an existing Billy expense ID skips them instead of duplicating them.
- Import can optionally create missing bill types and payer profiles and returns a row-level error summary.
- Added a downloadable CSV template for migrations from spreadsheets or other trackers.
- Added filtered export by bill type, paid/unpaid status and billing-month range.
- CSV export is round-trip friendly and includes recurrence, competence dates, payer/split, payment date, due date and notes.
- Excel export creates an `.xlsx` workbook with **Bills** and **Monthly summary** sheets.
- PDF export creates a printable report with KPIs, category totals, bill details and selectable **Payments**, **Normalized monthly cost**, or both trends.
- CSV, XLSX and PDF files are generated locally by Billy with no external cloud service.

## 0.4.8

### Paid / unpaid history filter

- Added a **Status** filter to **All bills**.
- History can now show **All**, **Unpaid** or **Paid** bills only.
- The status filter combines with bill type, year/month-range filters and pagination.
- Changing the status filter resets pagination to the first page.

## 0.4.7

### Optional bill dates

- Added an optional exact **payment date** to every bill.
- Added an optional **due/expiration date** to every bill.
- Both dates are persisted, editable and shown in the current-month list and complete history.
- Storage schema upgraded to v7; existing bills migrate with both dates empty.

### Default payer selector fix

- Fixed bill-type create/edit flows where the default payer selector could fail to expose a usable payer choice.
- Replaced the empty-string choice with a stable internal `None` sentinel and list active configured payers while preserving an already-selected disabled payer for editing.

### Compact current-month list

- Replaced the generic recent-bills list with bills whose payment month is the current month.
- Added a **Show / Hide** control so the section can be collapsed without losing access to **All bills**.
- Removed the obsolete “recent bills count” option from the visual card editor. Existing YAML containing `recent` remains harmless.

## 0.4.6

### Frontend loading reliability

- Fixed the Home Assistant card picker getting stuck with `Custom element not found: bill-tracker-card` on cold/clean installs.
- Added a tiny frontend bootstrap that registers `bill-tracker-card` and its visual editor immediately, before lazy-loading the full Billy UI.
- Billy is now registered through both Home Assistant's global frontend module mechanism and the Lovelace resource collection when storage resources are available.
- Added a safe fallback for YAML resource mode and older resource collections without mutating unloaded Lovelace storage.
- The existing `/bill_tracker/bill-tracker-card.js` URL remains valid, so manual dashboard resources do not need to be changed.

## 0.4.5

### Bill history modal

- **Tutte le bollette** now opens in a dedicated modal instead of expanding the dashboard card.
- The modal is paginated (10/20/50 items per page).
- Added filters by bill type, single year, or an arbitrary month/year range.
- Payment checkmarks remain editable directly from the paginated list.
- Editing a bill opens the existing edit modal above the history modal and preserves filters/page context.

### Outstanding split balance fix

- Fixed payer balances so they are calculated **only from unpaid bills**.
- Paid bills are excluded from the person-to-person balance.
- Pairwise debts are netted only between the people actually involved, keeping every displayed balance traceable to its source bills.
- Example: two unpaid bills of €179 and €25 at 50/50 now correctly produce a €102 balance.

### Settle balance closes the underlying bills

- Clicking **Segna saldato** now marks every unpaid bill contributing to that balance as paid.
- Those bills immediately show the paid checkmark in recent/history lists and disappear from the outstanding balance.
- Settlement history stores the linked bill IDs.
- Undoing a settlement reopens its linked bills as unpaid (unless another settlement still references them).
- Storage schema upgraded to v6.

## 0.4.4

- Editing a bill now opens in a centered modal instead of moving the shared add/edit form above the dashboard content.
- The all-bills view keeps the active category filter and scroll context while editing.
- The edit dialog can be closed with Annulla, the close button, the backdrop, or Escape.
- Mobile edit view uses a bottom-aligned dialog for easier touch interaction.

## 0.4.3

### Complete bill history and quick payment status

- Added **Tutte le bollette** next to the recent-bills section.
- The complete history can be filtered by bill type, including disabled types that still have history.
- Every item in the complete list has an interactive payment checkmark.
- Toggling the checkmark saves `paid` immediately without opening the edit form.
- Added a dedicated `bill_tracker/set_paid` WebSocket command so changing payment status never rewrites amount, category, payer, split or competence period.
- Recent bills keep the read-only green checkmark for paid entries.
- Payment status changes immediately recalculate unpaid totals, payment charts and payer reimbursements.

## 0.4.2

### Outstanding balance fix

- Fixed the dashboard balance logic: **Bollette da pagare** now sums only bills where `paid = false`.
- Paid bills are excluded from the outstanding bill balance.
- Person-to-person split reimbursements remain separate and are shown under **Rimborsi tra paganti**.
- Added separate `unpaid_total` and `reimbursement_total` summary attributes; `outstanding_total` now follows the unpaid-bills meaning for compatibility with the dashboard.

## 0.4.1

### Explicit bill payment status

- Added an explicit **Bolletta pagata** checkbox to the add/edit form.
- New bills default to unpaid until the checkbox is selected.
- Existing v0.4.0 and older bills migrate as unpaid when no explicit status exists; editing them does not mark them paid automatically.
- Recent bills show a green checkmark only when they are marked paid.
- “Pagata da” is now treated as the configured payer/advance owner, independently from the paid/unpaid status.
- Only paid bills affect payer balances and outstanding split debts.
- The **Pagamenti** monthly series and “Pagato questo mese” summary include only bills explicitly marked paid.
- Forecasting and normalized competence costs continue to use the bill history regardless of payment status.
- Storage schema upgraded to v5.

## 0.4.0

### Bill splitting and payers

- Added persistent payer profiles managed from **Settings → Devices & services → Bill Tracker → Configure**.
- Each payer can have a default split share, PayPal.Me username/link and active/disabled state.
- Each bill type can define a default payer.
- Every bill can override both the payer and the percentage split.
- Added automatic netting: Billy calculates the minimum outstanding transfers between payers instead of showing reciprocal debts separately.
- Added **Pay with PayPal** links with the outstanding EUR amount pre-filled through PayPal.Me.
- Added **Mark as settled** and persistent settlement history.
- Settlements can be removed to recalculate the balance after a mistake.
- Payers referenced by history cannot be deleted accidentally; they can be disabled instead.

### Dashboard and chart

- Added an outstanding-balance panel to the Lovelace card.
- Added payer/split information to recent bill rows.
- Monthly bars are now stacked by bill type, with a stable color per category and percentage details in SVG tooltips.
- Bill type settings now include a chart color.
- Default Sections width is now `full`; numeric widths remain supported.
- Updated the visual card editor to include full-width mode.

### Data model

- Storage schema upgraded to v4.
- v0.3 databases are migrated automatically. Existing bills remain intact and are left unassigned to payers until edited, avoiding invented historical splits.
- Existing recurrence, competence-period, normalized-cost and forecast features are preserved.

## 0.3.0

- Added centrally managed bill types.
- Added monthly, bimonthly, quarterly, four-monthly, half-yearly and yearly recurrences.
- Added competence periods and normalized monthly costs.
- Added category-aware forecasts and upcoming bills.
- Added HACS-ready frontend packaging.

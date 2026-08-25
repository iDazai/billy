## 0.6.3 parser compatibility

Billy 0.6.3 adds support for abbreviated Italian dates used in provider invoices and anchors automatic imports to the billing/competence month before the due date. The 0.5.2-based dashboard UI from 0.6.2 is unchanged.

# Billy 0.6.2

Billy is a Home Assistant custom integration for tracking recurring household bills,
forecasting upcoming costs, splitting expenses between payers and importing bill data.

This archive is a **complete source package** for the integration. It is not an overlay:
`custom_components/bill_tracker` contains the full Python integration, Lovelace frontend,
translations, automatic parser runtime, IMAP source adapter and tests required by this build.

## 0.6.x automatic parsing

- External `billy-parser` catalog (`parser.json`) with SHA-256 verified downloads.
- Declarative YAML parser schema v1; downloaded parsers cannot execute Python/JavaScript/shell code.
- Official parsers stored under `/config/billy/parsers/official`.
- Custom parsers stored under `/config/billy/parsers/custom` and exportable.
- Home Assistant IMAP integration using metadata prefiltering before message-body fetching.
- PDF text extraction via `pypdf`; OCR is intentionally out of scope.
- Email/PDF cross-verification, confidence scoring, review queue and optional verified auto-import.
- Source and semantic deduplication.
- Parser/source/review management through the native Billy options flow.

## 0.6.2 fixes

- Restored the bill-history filters removed by the first 0.6 frontend rewrite:
  bill type, paid/unpaid status, all history/year/month range, page size and pagination.
- Restored the styled **Pay with PayPal** action and localized reimbursement counts.
- Fixed IMAP event scheduling so parser processing runs on the Home Assistant event loop.
- Fixed hassfest manifest ordering and the config-entry-only `CONFIG_SCHEMA`.
- Registers the Lovelace resource after Lovelace setup and bumps frontend assets to 0.6.2
  to invalidate stale browser caches.

See `docs/AUTOMATIC_PARSING.md` for parser setup and privacy details.

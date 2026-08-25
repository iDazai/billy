## Billy 0.9.1

Billy keeps the Lovelace `custom:bill-tracker-card`, while the `/billy` sidebar panel is the full-size application.

### Sidebar application

- **Panoramica / Overview**: wide dashboard with KPI, forecast, bill-type breakdown, upcoming/recent bills, parser health and a dedicated **Rimborsi tra utenti / User reimbursements** section.
- **Bollette / Bills**: native complete bill list instead of embedding the Lovelace card. It includes search/filtering, pagination, manual bill creation, edit/delete actions and a quick provider-payment toggle.
- **Parser**: scalable catalog with country/type/status filters, Outdated markers and explicit install/update/remove actions.
- **Impostazioni / Settings**: bill types, payers, IMAP sources, system status and a new **Developer & support** area.

### Provider payments vs user reimbursements

Billy now treats these as two independent concepts:

- **Bolletta pagata / Provider paid** means the configured payer actually paid the utility/provider invoice.
- **Rimborso tra utenti / User reimbursement** means another Billy participant reimbursed their share to the payer.

Confirming a reimbursement no longer marks provider bills as paid, and undoing a reimbursement no longer reopens provider bills. Split balances are calculated from bill shares independently of the provider-payment checkbox, then reduced by recorded reimbursements.

The Overview provides quick **Pay with PayPal** and **Confirm reimbursement** actions, plus recent reimbursement history.

### Reimbursement status in Bills

The full **Bollette / Bills** tab now has an independent reimbursement filter and status for each bill. You can filter bills by **To reimburse**, **Reimbursed**, or **No reimbursement**. A bill with multiple participants can also show **Partially reimbursed**.

When no reimbursement has already been recorded in the reimbursement history, the row includes a quick checkbox to mark all user reimbursements for that bill as completed or pending. This changes only the user-to-user balance; it never changes whether the provider invoice itself is paid. Bills linked to recorded reimbursement history are intentionally locked to that history to prevent double-accounting.

### Developer & support

The Billy Settings panel now credits **Roberto Tortora** as creator/maintainer and links to:

- Billy: `https://github.com/robin994/billy`
- billy-parser: `https://github.com/robin994/billy-parser`
- GitHub profile: `https://github.com/robin994`
- LinkedIn: `https://www.linkedin.com/in/roberto-tortora-379928109/`
- optional PayPal.Me support: `https://paypal.me/rtortora94`

Both repositories include an explicit action encouraging users to open the project and leave a GitHub star.

The parser catalog continues to refresh automatically every day at **00:00 Home Assistant local time** without silently upgrading installed parser YAML files. The Lovelace resource stays unversioned at `/bill_tracker/bill-tracker-card.js`.

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


## Billy sidebar panel

Billy 0.7.0 adds a sidebar panel at `/billy` while keeping `custom:bill-tracker-card` available for Lovelace dashboards. The panel reuses the existing bill UI and includes scalable parser management in the same application surface.

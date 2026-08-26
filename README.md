## Billy 0.11.0

Billy keeps the Lovelace `custom:bill-tracker-card`, while `/billy` is the full-size application.

### Recurring expenses

The new **Ricorrenti / Recurring** tab tracks predictable costs that normally do not arrive as a monthly invoice email: subscriptions, mortgages, installment plans and other fixed recurring charges. Each rule can define an amount, cadence (monthly, every 2/3/4/6 months or yearly), activation date, optional expiration/renewal date, automatic renewal, provider/contract metadata and notes.

Installment plans can also define a total installment count. Billy calculates the final due date, how many installments remain and the remaining committed amount. Recurring rules can be paused, resumed, edited or deleted without creating fake provider invoices in bill history.

Recurring charges are included in the regular **forecast** on their exact due months. The normalized forecast also includes their monthly-equivalent cost, so an annual subscription contributes `amount / 12` to the normalized monthly planning view. Overview now shows recurring monthly equivalent, charges due next month, active recurring count and remaining installment commitment.

Provider bills and recurring rules remain separate concepts: a recurring rule predicts a cost; it does not mark a provider invoice as paid and it is not an email-parser result.

### Parser authoring in Billy

The **Parser** tab can create a new local custom parser, edit it, validate/test it against optional email metadata, export it and publish its YAML as an Experimental community submission. No invoice PDF, email body or attachment is uploaded by the publish action.

### Main sidebar areas

- **Panoramica / Overview** — full-width dashboard, forecasts, reimbursements and recurring commitments.
- **Bollette / Bills** — complete provider-bill history with manual CRUD, payment status and user-reimbursement status.
- **Ricorrenti / Recurring** — subscriptions, mortgages, installments and predictable scheduled costs.
- **Parser** — catalog plus local custom parser authoring and Experimental publishing.
- **Impostazioni / Settings** — bill types, payers, IMAP sources, system status and developer/support links.

The Lovelace resource remains `/bill_tracker/bill-tracker-card.js` without a version query string.

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

## Community parser publishing

Billy's Parser page can publish a locally saved custom parser to the community catalog as **Experimental**. Billy opens a pre-filled GitHub issue containing only the declarative YAML. The repository workflow validates it and can publish it automatically without maintainer approval. Parser quality is shown as Verified, Tested or Experimental in the catalog.

Experimental ownership comes from the GitHub issue author; community submissions cannot overwrite official/tested/verified parsers or another contributor's experimental parser.

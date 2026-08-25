# Changelog

## 0.6.4

- Fix automatic parsing of PDF attachments exposed by IMAP as `application/octet-stream` when the parser filename rule matches.
- Preserve `imap_content` attachment metadata when merging the later `imap.fetch` response.
- Allow failed IMAP parse attempts to be retried after updating a parser instead of permanently deduplicating the UID.
- Include available attachment metadata in parser failure logs for easier diagnosis.

# Billy 0.6.3

## Added

- Parser-engine support for abbreviated Italian month names and two-digit years used by provider PDFs such as `01 lug 26 - 31 lug 26`.

## Fixed

- Automatic imports now anchor the bill to the parsed competence/billing month first, then the invoice issue date, instead of incorrectly preferring a later due date.

# Billy 0.6.2

## Fixed

- Restored bill-history filtering and pagination in the Lovelace card.
- Restored the styled PayPal payment action and localized bill counts in reimbursements.
- Fixed IMAP callback scheduling for current Home Assistant thread-safety checks.
- Fixed hassfest manifest key order and config-entry-only schema warning.
- Delayed Lovelace resource registration until Lovelace setup completes.
- Bumped frontend asset version to 0.6.2 to avoid stale cached UI files.

# Billy 0.6.0

## Added

- Automatic email bill parsing subsystem.
- External parser catalog support via `billy-parser/parser.json`.
- SHA-256, size, identity, schema and minimum-version validation for downloaded parsers.
- Declarative YAML parser engine with weighted detection and metadata prefilters.
- Home Assistant IMAP source adapter using `imap.fetch` and `imap.fetch_part`.
- PDF text extraction with `pypdf`.
- Email/PDF field cross-verification and confidence scoring.
- Pending import queue with approve/reject actions.
- Optional verified auto-import, disabled by default.
- Source and invoice-level deduplication.
- Official/custom parser persistence outside the HACS integration directory.
- Custom parser creation, validation and authenticated YAML export.
- Native options-flow pages for source, catalog, installed parser and review management.
- Parser WebSocket API for future frontend surfaces.

## Privacy

- Message bodies are fetched only after sender/subject metadata passes at least one
  installed parser prefilter.
- Attachments are fetched only when required by the selected parser.
- Raw message bodies and PDF bytes are not persisted by Billy.
- No mail or invoice content is sent to the parser repository.

## Not included yet

- OCR/scanned-PDF support.
- Gmail API or Outlook OAuth source adapters.
- Historical mailbox crawling.

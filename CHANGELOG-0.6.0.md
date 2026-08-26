# 0.6.1 hotfix

- Restored bill history filtering by type, status, year/month range and pagination.
- Restored the styled PayPal payment action and localized reimbursement bill counts.
- Kept automatic parser status/settings integration in the card.
- Fixed IMAP event scheduling on the Home Assistant event loop.
- Fixed hassfest manifest ordering and config-entry-only schema warning.
- Delayed Lovelace resource registration until Lovelace setup completes.
- Bumped frontend assets to 0.6.1 to invalidate stale browser/Lovelace caches.

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

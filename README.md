# Billy 0.6.0 automatic parsing upgrade

This package contains the files added or changed by Billy 0.6.0 and is based on
`robin994/billy` **0.5.2** (`0ea179929a8ac295fb072d0792606e5f4c16ad73`).

Extract it over a clean 0.5.2 checkout. Files not present in this archive are
unchanged from 0.5.2 and must be kept (for example `manager.py`, the existing
large Lovelace implementation and existing translations/assets).

## What 0.6.0 adds

- External `billy-parser` catalog (`parser.json`) with SHA-256 verified downloads.
- Declarative YAML parser schema v1. No downloaded Python/JavaScript/shell code.
- Official parsers stored under `/config/billy/parsers/official`.
- Custom parsers stored under `/config/billy/parsers/custom` and exportable again.
- Home Assistant IMAP source with privacy-first metadata prefiltering.
- Email body and PDF attachment retrieval only after a parser prefilter matches.
- PDF text extraction through `pypdf`; OCR is intentionally out of scope for 0.6.0.
- Email/PDF cross-verification and a review queue.
- Optional auto-import, disabled by default and blocked when verification conflicts.
- Source and semantic deduplication.
- Parser/source/review management in the native Billy options flow.
- WebSocket API for frontend integrations and an authenticated custom-parser download route.

See `docs/AUTOMATIC_PARSING.md` for setup and privacy details.

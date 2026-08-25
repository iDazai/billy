# Automatic bill parsing — Billy 0.6.0

Billy 0.6.0 adds a separate parsing subsystem. The existing `BillTrackerManager`
continues to own expenses; parsers only produce reviewed `BillCandidate` data.

## Data flow

```text
Home Assistant IMAP event
  -> selected IMAP source check
  -> parser metadata prefilter (sender / subject)
  -> fetch matching message body
  -> weighted parser detection
  -> fetch only the attachment required by the winning parser
  -> PDF/text normalization
  -> declarative parser engine
  -> email/PDF verification
  -> deduplication
  -> review queue OR verified auto-import
  -> BillTrackerManager
```

## Privacy model

Billy does **not** fetch every email body and then search it for invoices.

1. Home Assistant's IMAP integration observes the mailbox/folder/search that the
   user configured in Home Assistant.
2. Billy listens only to IMAP config entries explicitly selected in Billy.
3. For each event Billy initially uses the metadata already present in the
   `imap_content` event: sender, subject, UID and MIME-part metadata.
4. Installed parsers have a `prefilter` section. If no parser passes that
   metadata prefilter, Billy does not call `imap.fetch`.
5. Only after a prefilter match is the email body fetched locally.
6. A PDF/part is fetched only when the selected parser asks for that part.
7. Raw email bodies and PDF bytes are not stored by Billy. The persistent import
   record contains normalized bill fields plus limited source metadata used for
   deduplication and troubleshooting.
8. Email/PDF content is not sent to `billy-parser` or any AI/cloud parsing API.

For maximum isolation, configure a dedicated IMAP folder/search for utility
providers before selecting that IMAP entry in Billy.

## Setup

1. Add Home Assistant's **IMAP** integration for the mailbox/folder you want Billy
   to observe.
2. Open Billy integration options -> **Automatic bill parsing** -> **Email sources**
   and select the permitted IMAP entry or entries.
3. Open **Parser catalog**. Billy downloads `parser.json` from `billy-parser`.
4. Select a parser and map it to one of your existing Billy bill types.
5. Keep **Automatically import verified bills** disabled for the first bills.
6. New candidates appear under **Bills waiting for review**.
7. Once a parser is proven reliable you can enable automatic import for it.

## Parser storage

Parser files intentionally live outside the HACS integration directory so HACS
updates do not delete them:

```text
/config/billy/parsers/
  official/
  custom/
```

Parser configuration, source selection and import history use a separate Home
Assistant Store key: `bill_tracker.parsers`.

## Catalog integrity

The catalog entry contains a parser path, version, byte size and SHA-256 checksum.
Billy downloads the parser from the catalog's immutable `source_commit` whenever
possible and validates all of those fields before saving the parser.

## Parser security

Schema v1 is declarative. Community/custom parser files cannot execute Python,
JavaScript, shell commands, Jinja, filesystem operations or arbitrary HTTP
requests. Supported v1 operations are bounded matching/extraction plus text,
decimal, date and date-range transforms.

## Automatic import safety

A parser can opt into automatic import only through local Billy configuration.
Even then Billy keeps a candidate in the review queue when email/PDF verification
reports a conflict or when confidence is below the auto-import threshold.

## E.ON reference parser

The first `billy-parser` fixture is `it.eon.electricity`. It was validated against
an actual E.ON email + digitally generated PDF pair. It extracts invoice number,
issue date, amount due, billing period, due/debit date, consumption, customer code,
POD, offer and payment method. The repository fixture itself is synthetic and
contains no customer data.

## 0.6.0 limitations

- Digitally generated PDFs with an extractable text layer only; no OCR yet.
- IMAP is the first mail source. The source abstraction is intentionally separate
  so Gmail API / Outlook OAuth adapters can be added later.
- Billy does not rewrite an IMAP integration's server-side search automatically.
  The user controls that scope in Home Assistant; Billy adds its own metadata
  prefilter before fetching content.
- Existing emails are handled when Home Assistant emits an `imap_content` event;
  0.6.0 does not implement a general mailbox-history crawler.

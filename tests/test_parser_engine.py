from pathlib import Path
import sys

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "custom_components" / "bill_tracker"))

from parser.engine import ParserEngine  # noqa: E402
from parser.models import DocumentBundle, MailEnvelope  # noqa: E402
from parser.validator import validate_parser  # noqa: E402


def _parser():
    return yaml.safe_load(
        """
schema: 1
id: test.utility.electricity
version: 1
metadata:
  name: Test utility
  country: IT
  language: it
  provider: Test Utility
  bill_type: electricity
  min_billy_version: 0.6.0
prefilter:
  email:
    from: [billing@example.test]
detection:
  threshold: 50
  rules:
    - source: email.from
      equals: billing@example.test
      weight: 50
documents:
  email:
    enabled: true
fields:
  amount:
    required: true
    candidates:
      - source: email
        regex: 'Totale: (?P<value>[0-9.,]+) EUR'
    transform:
      type: decimal
      locale: it_IT
  period:
    required: true
    outputs: [period_start, period_end]
    candidates:
      - source: email
        regex: 'Periodo: (?P<start>\\d{2} [a-z]+) - (?P<end>\\d{2} [a-z]+ \\d{4})'
    transform:
      type: date_range
      locale: it_IT
      infer_missing_year: true
"""
    )


def test_metadata_prefilter_and_date_range():
    parser = _parser()
    validate_parser(parser)
    envelope = MailEnvelope(
        entry_id="entry",
        uid="1",
        sender="Test Utility <billing@example.test>",
        subject="Bolletta",
    )
    documents = DocumentBundle(
        email="Totale: 123,45 EUR\nPeriodo: 01 luglio - 31 luglio 2026"
    )
    engine = ParserEngine()
    assert engine.prefilter(parser, envelope)
    assert engine.detect(parser, envelope, documents) == (True, 50, 50)
    data = engine.parse(parser, envelope, documents)["data"]
    assert data["amount"] == 123.45
    assert data["period_start"] == "2026-07-01"
    assert data["period_end"] == "2026-07-31"


def test_wrong_sender_does_not_pass_prefilter():
    parser = _parser()
    envelope = MailEnvelope(
        entry_id="entry",
        uid="2",
        sender="someone@example.test",
        subject="Bolletta",
    )
    assert not ParserEngine().prefilter(parser, envelope)

"""PDF text extraction for digitally generated invoices."""
from __future__ import annotations

from io import BytesIO

from pypdf import PdfReader

MAX_PDF_BYTES = 12 * 1024 * 1024
MAX_PAGES = 40
MAX_TEXT_CHARS = 1_500_000


class PdfExtractionError(ValueError):
    """Raised when a PDF cannot be safely converted to text."""


def extract_pdf_text(content: bytes) -> str:
    if not content:
        raise PdfExtractionError("Empty PDF attachment")
    if len(content) > MAX_PDF_BYTES:
        raise PdfExtractionError("PDF attachment is too large")
    try:
        reader = PdfReader(BytesIO(content), strict=False)
    except Exception as err:
        raise PdfExtractionError("Unable to open PDF attachment") from err
    if len(reader.pages) > MAX_PAGES:
        raise PdfExtractionError("PDF has too many pages")

    chunks: list[str] = []
    size = 0
    for page in reader.pages:
        try:
            text = page.extract_text() or ""
        except Exception as err:
            raise PdfExtractionError("Unable to extract text from PDF") from err
        if text:
            chunks.append(text)
            size += len(text)
            if size >= MAX_TEXT_CHARS:
                break
    result = "\n".join(chunks)[:MAX_TEXT_CHARS].strip()
    if len(result) < 20:
        raise PdfExtractionError("PDF does not contain extractable text; OCR is not supported in 0.6.0")
    return result

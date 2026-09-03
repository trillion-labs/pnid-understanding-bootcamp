# Output contract

Use this contract when findings will be compared, reviewed, or reused. Exploratory answers do not need every field.

## Single-drawing result

```json
{
  "document_id": "drawing identifier from source",
  "revision": "revision from source",
  "question_id": "local evaluation identifier",
  "findings": [],
  "relationship_summary": "short traced relationship",
  "unresolved_fields": [],
  "review_status": "needs_human_review"
}
```

## Finding

```json
{
  "field": "requested field name",
  "observed_text_or_symbol": "exact visible transcription",
  "inferred_component": "component interpretation or unknown",
  "source_path": "path to inspected image or PDF",
  "page": 1,
  "evidence_region": "human-readable region name",
  "bbox": [0, 0, 1, 1],
  "confidence": "high",
  "status": "confirmed",
  "note": "relationship or neighboring-label check"
}
```

## Required distinctions

- `observed_text_or_symbol` is a transcription of visible content.
- `inferred_component` is an interpretation and may remain `unknown`.
- `confidence` describes readability of the evidence.
- `status` records whether the finding was confirmed, needs correction, or remains unresolved.
- `unresolved_fields` prevents requested fields from being silently omitted.

## Minimal human-readable answer

1. Requested fields with exact visible values.
2. A short relationship summary describing the traced path.
3. Evidence locations for each field.
4. Unreadable or contradictory fields.

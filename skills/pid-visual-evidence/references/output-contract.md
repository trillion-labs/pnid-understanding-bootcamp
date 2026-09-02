# Output contract

Use this contract when the result will be compared, reviewed, or reused. Exploratory answers do not need every field.

## Retrieval answer

```json
{
  "query_id": "Q005",
  "decision_drawing_id": "J-11520-ZM-105-005",
  "decision_revision": "F",
  "retrieval_confidence": "high",
  "evidence_confidence": "medium",
  "confirmed_terms": [],
  "unresolved_terms": [],
  "evidence": [],
  "review_status": "needs_human_review"
}
```

## Evidence item

```json
{
  "term": "VIBRO FEEDER #C",
  "observed_text": "VIBRO FEEDER #C",
  "inferred_component_class": "vibro_feeder",
  "source_path": "source/sample-pid.pdf",
  "page": 1,
  "region_id": "R03",
  "bbox": [0, 0, 1, 1],
  "confidence": "high",
  "review_status": "confirmed"
}
```

## Required distinctions

- `observed_text` is a transcription of visible text.
- `inferred_component_class` is an interpretation and may remain `unknown`.
- `retrieval_confidence` concerns the selected drawing.
- `evidence_confidence` concerns the correctness of the supporting component-level evidence.
- `unresolved_terms` prevents missing query terms from being silently ignored.

## Minimal human-readable answer

1. Selected drawing ID and revision.
2. Confirmed query terms with source regions.
3. Unresolved or contradictory terms.
4. A short note explaining why sibling candidates were rejected.

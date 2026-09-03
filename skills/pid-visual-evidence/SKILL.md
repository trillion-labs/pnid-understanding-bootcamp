---
name: pid-visual-evidence
description: Inspect a provided P&ID image or PDF, transcribe specified tags, trace local equipment relationships, and return reviewable visual evidence. Use for single-drawing extraction or answer review, not for design, operations, isolation, or safety decisions.
---

# P&ID Visual Evidence

Answer from visible, reviewable evidence in the provided drawing. Do not turn nearby labels into a relationship without tracing the connecting line or symbol.

## Workflow

1. Preserve the original and record the drawing ID, revision, page, image dimensions, and whether a usable text layer exists.
2. Convert the request into fields that can be checked independently, such as an equipment tag, valve number, connected motor tag, or local relationship.
3. Use the overview to locate the repeated equipment group. Do not transcribe small tags from a resolution where their characters are unclear.
4. Enlarge the smallest region that contains every object and connection needed for the requested fields. Include enough surrounding context to distinguish neighboring equipment.
5. Transcribe visible strings exactly. Record unreadable characters as `unknown` instead of completing a plausible tag.
6. Trace each requested relationship from the source object along the visible line. Confirm that a nearby label belongs to the target rather than to an adjacent object.
7. Record each finding with its source image, page, named region or location box, confidence, and review status.
8. Return only the requested fields, a short relationship summary, and unresolved items.

## Evidence rules

- `observed`: text, symbol, or connection directly visible in the drawing.
- `inferred`: an interpretation based on visible evidence; keep it separate from the transcription.
- `unknown`: not readable or not resolvable from the provided image.
- OCR is a search aid, not proof. Confirm critical strings in the image.
- A more detailed prompt is not automatically better. Add a checking rule only when an observed error justifies it.
- A location box must contain the context needed to review the claim, not merely the smallest possible object.

For reusable structured output, read [references/output-contract.md](references/output-contract.md).

## Completion check

- Every requested field is confirmed or marked `unknown`.
- Each confirmed value can be located again in the source image.
- Relationships were traced, not inferred from proximity alone.
- Neighboring equipment tags were not mixed with the target equipment.
- The final answer does not include unrequested design, operating, or safety conclusions.

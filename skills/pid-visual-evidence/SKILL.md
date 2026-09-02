---
name: pid-visual-evidence
description: Read P&ID PDFs and images with coarse-to-fine visual inspection, evidence localization, and uncertainty tracking. Use when finding the most relevant P&ID, extracting equipment or tags, or verifying that an answer is grounded in a specific region. Do not use for authoritative design, operations, isolation, or safety decisions.
---

# P&ID Visual Evidence

Ground P&ID answers in visible, reviewable evidence. Prefer a small number of purposeful inspections over exhaustive browsing.

## Choose the task mode

- Retrieval: select the most relevant drawing from candidates.
- Extraction: record visible equipment, text, tags, or relationships.
- Review: verify an existing answer without adding new candidates.

If the user only wants a high-level explanation of one drawing, an exploratory answer may be enough; do not force bbox or structured output.

## Workflow

1. Inspect the file set and preserve the original files. Record the drawing ID, revision, page count, and whether a usable text layer exists.
2. Narrow candidates using filenames, titles, catalog metadata, or OCR. Treat this as retrieval support, not proof of component presence.
3. View candidate pages as low-resolution overviews. Identify title blocks, legends, repeated equipment groups, and regions worth enlarging. Do not read small tags from the overview.
4. Crop only the regions needed to test the query terms. Keep overlap when a component or line crosses a crop boundary.
5. Inspect one evidence type at a time when useful: equipment, text/tag, then connection or symbol meaning.
6. Record observed text separately from inferred class or function. Use `unknown` when characters or component meaning are not visible.
7. Reconcile the crop with the overview before deciding. A crop can prove local text but can lose drawing-wide context.
8. Return the minimum answer that satisfies the task and include evidence location, unresolved query terms, and review status.

## Retrieval decisions

- Prefer one drawing ID when the task asks for the most relevant drawing.
- Do not select a sheet only because its family title matches. Verify the discriminating query terms in the page image.
- Check plausible sibling sheets when the drawing is part of a numbered series.
- A correct drawing ID with incorrect component evidence is not a fully correct result.

## Evidence rules

- `observed`: directly visible text, symbol, or connection.
- `inferred`: domain interpretation based on observed evidence.
- `unknown`: not resolvable from the inspected source.
- Location may be a named region for exploratory work and a bbox for extraction or evaluation.
- OCR confidence is not proof. Confirm critical text in the image.
- Do not equate nearby labels by proximity alone. For example, an `E-MT` label beside an `EM` symbol is motor evidence, not automatically an expansion-joint tag.

For a reusable extraction or evaluation result, read [references/output-contract.md](references/output-contract.md).

## Completion check

- Every decisive query term is confirmed, contradicted, or marked unresolved.
- The drawing ID and revision come from the inspected source.
- Evidence locations point to the source image or crop.
- Component meanings are not asserted solely from OCR or filename metadata.
- The final answer separates retrieval confidence from evidence confidence.

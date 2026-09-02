#!/usr/bin/env python3
import csv
import sys
from pathlib import Path


def as_int(value: str) -> int:
    if value is None or value.strip() == "":
        return 0
    return int(float(value))


def score(row: dict[str, str]) -> dict[str, str]:
    if row.get("status") != "completed":
        return row

    drawing_exact = row.get("decision_drawing_id") == row.get("expected_drawing_id")
    extra_ids = [item for item in row.get("extra_drawing_ids", "").split("|") if item]
    retrieval_score = (2 if drawing_exact else 0) + (1 if not extra_ids else 0)

    required = max(as_int(row.get("required_term_count", "0")), 1)
    confirmed = min(as_int(row.get("confirmed_term_count", "0")), required)
    evidence_locations = as_int(row.get("evidence_location_count", "0"))
    component_errors = as_int(row.get("component_error_count", "0"))
    unsupported = as_int(row.get("unsupported_claim_count", "0"))
    appropriate_unknowns = as_int(row.get("appropriate_unknown_count", "0"))

    term_points = round(2 * confirmed / required, 3)
    location_points = min(evidence_locations, 2)
    evidence_score = max(0.0, term_points + location_points + min(appropriate_unknowns, 1) - 2 * component_errors - unsupported)

    row["drawing_exact"] = "true" if drawing_exact else "false"
    row["retrieval_score"] = str(retrieval_score)
    row["evidence_score"] = str(round(evidence_score, 3))
    row["total_score"] = str(round(retrieval_score + evidence_score, 3))
    return row


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: score_skill_experiment.py INPUT.csv OUTPUT.csv")

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with input_path.open(newline="", encoding="utf-8") as stream:
        reader = csv.DictReader(stream)
        rows = [score(dict(row)) for row in reader]
        fieldnames = reader.fieldnames

    if not fieldnames:
        raise SystemExit("input CSV has no header")

    with output_path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    completed = sum(row.get("status") == "completed" for row in rows)
    print(f"wrote {output_path} ({completed}/{len(rows)} completed runs scored)")


if __name__ == "__main__":
    main()

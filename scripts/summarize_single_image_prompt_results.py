#!/usr/bin/env python3
import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "experiments" / "single-image-prompt" / "results" / "verifiable-v3"
RAW = BASE / "raw"
REVIEWS = BASE / "manual-review.csv"
OUT = BASE / "summary.csv"


def parse_claude(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    usage = data.get("usage", {})
    model_usage = data.get("modelUsage", {})
    selected = "sonnet" if "sonnet" in path.name else "haiku"
    return {
        "provider": "claude",
        "model": selected,
        "condition": path.stem.removeprefix(f"claude-{selected}-"),
        "duration_sec": round((data.get("duration_ms") or 0) / 1000, 3),
        "input_tokens": usage.get("input_tokens", ""),
        "cache_creation_input_tokens": usage.get("cache_creation_input_tokens", ""),
        "cached_input_tokens": usage.get("cache_read_input_tokens", ""),
        "output_tokens": usage.get("output_tokens", ""),
        "reported_cost_usd": data.get("total_cost_usd", ""),
        "comparison_cost_usd": data.get("total_cost_usd", ""),
        "cost_basis": "claude_cli_reported",
        "model_usage_keys": "|".join(model_usage.keys()),
        "raw_path": str(path.relative_to(ROOT)),
    }


def parse_codex(path: Path) -> dict:
    events = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    usage = next((event.get("usage", {}) for event in reversed(events) if event.get("type") == "turn.completed"), {})
    selected = "terra" if "terra" in path.name else "luna"
    input_rate, cached_rate, output_rate = ((2.0, 0.2, 12.0) if selected == "terra" else (0.2, 0.02, 1.2))
    total_input = int(usage.get("input_tokens", 0) or 0)
    cached_input = int(usage.get("cached_input_tokens", 0) or 0)
    output_tokens = int(usage.get("output_tokens", 0) or 0)
    uncached_input = max(0, total_input - cached_input)
    estimated_cost = (uncached_input * input_rate + cached_input * cached_rate + output_tokens * output_rate) / 1_000_000
    condition = path.name.removeprefix(f"codex-{selected}-").removesuffix(".jsonl")
    return {
        "provider": "codex",
        "model": selected,
        "condition": condition,
        "duration_sec": "",
        "input_tokens": usage.get("input_tokens", ""),
        "cache_creation_input_tokens": usage.get("cache_write_input_tokens", ""),
        "cached_input_tokens": usage.get("cached_input_tokens", ""),
        "output_tokens": usage.get("output_tokens", ""),
        "reported_cost_usd": "",
        "comparison_cost_usd": round(estimated_cost, 8),
        "cost_basis": "openai_api_equivalent_estimate",
        "model_usage_keys": "",
        "raw_path": str(path.relative_to(ROOT)),
    }


def main() -> None:
    records = []
    for path in sorted(RAW.glob("claude-*.json")):
        records.append(parse_claude(path))
    for path in sorted(RAW.glob("codex-*.jsonl")):
        if path.stat().st_size:
            records.append(parse_codex(path))

    with REVIEWS.open(newline="", encoding="utf-8") as stream:
        reviews = {(row["provider"], row["model"], row["condition"]): row for row in csv.DictReader(stream)}

    merged = []
    for record in records:
        review = reviews[(record["provider"], record["model"], record["condition"])]
        merged.append({**record, **{key: value for key, value in review.items() if key not in {"provider", "model", "condition"}}})

    fieldnames = [
        "provider", "model", "condition", "evidence_score", "bin_tag",
        "outlet_valve", "feeder_tag", "motor_tag",
        "duration_sec", "input_tokens", "cache_creation_input_tokens", "cached_input_tokens",
        "output_tokens", "reported_cost_usd", "comparison_cost_usd", "cost_basis",
        "model_usage_keys", "review_note", "raw_path"
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(merged)
    print(f"wrote {OUT} ({len(merged)} rows)")


if __name__ == "__main__":
    main()

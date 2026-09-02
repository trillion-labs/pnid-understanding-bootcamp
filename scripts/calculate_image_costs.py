#!/usr/bin/env python3
import csv
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "image-cost-estimates.csv"
IMAGES = {
    "overview": (1600, 1132),
    "r03-crop": (1330, 1710),
}


def claude_tokens(width: int, height: int, max_edge: int, max_tokens: int) -> tuple[int, int, int]:
    scale = min(1.0, max_edge / max(width, height))
    width = max(1, int(width * scale))
    height = max(1, int(height * scale))
    while math.ceil(width / 28) * math.ceil(height / 28) > max_tokens:
        scale = math.sqrt(max_tokens / (math.ceil(width / 28) * math.ceil(height / 28))) * 0.999
        width = max(1, int(width * scale))
        height = max(1, int(height * scale))
    return math.ceil(width / 28) * math.ceil(height / 28), width, height


def openai_tokens(width: int, height: int, detail: str) -> tuple[int, int, int]:
    if detail == "high":
        scale = min(1.0, 2048 / max(width, height))
        width, height = int(width * scale), int(height * scale)
        while math.ceil(width / 32) * math.ceil(height / 32) > 2500:
            scale = math.sqrt(2500 / (math.ceil(width / 32) * math.ceil(height / 32))) * 0.999
            width, height = int(width * scale), int(height * scale)
    patches = math.ceil(width / 32) * math.ceil(height / 32)
    return math.ceil(patches * 1.2), width, height


def main() -> None:
    rows = []
    claude_models = {
        "claude-haiku-4.5": (1568, 1568, 1.0),
        "claude-sonnet-5": (2576, 4784, 2.0),
        "claude-opus-5": (2576, 4784, 5.0),
    }
    openai_models = {
        "gpt-5.6-luna": 0.20,
        "gpt-5.6-terra": 2.00,
        "gpt-5.6-sol": 4.00,
    }
    for image_name, (width, height) in IMAGES.items():
        for model, (max_edge, max_tokens, price) in claude_models.items():
            tokens, rw, rh = claude_tokens(width, height, max_edge, max_tokens)
            rows.append({"image": image_name, "width": width, "height": height, "provider": "anthropic", "model": model, "detail": "automatic tier", "processed_width": rw, "processed_height": rh, "image_input_tokens": tokens, "input_price_per_mtok": price, "estimated_image_cost_usd": tokens * price / 1_000_000})
        for model, price in openai_models.items():
            for detail in ("high", "original"):
                tokens, rw, rh = openai_tokens(width, height, detail)
                rows.append({"image": image_name, "width": width, "height": height, "provider": "openai", "model": model, "detail": detail, "processed_width": rw, "processed_height": rh, "image_input_tokens": tokens, "input_price_per_mtok": price, "estimated_image_cost_usd": tokens * price / 1_000_000})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(OUT)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import argparse
import csv
import re
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCES = [
    ("전체 도면", ROOT / "data/ocr/전체-도면-ocr.tsv"),
    ("Feeder #C 확대", ROOT / "data/ocr/feeder-c-area-improved.tsv"),
]

COMMON_CORRECTIONS = {
    "FEEDEK": "FEEDER",
    "FEEOER": "FEEDER",
    "VIBEO": "VIBRO",
    "VIBR0": "VIBRO",
}


def normalize(value: str) -> str:
    value = value.upper()
    value = value.replace("—", "-").replace("–", "-").replace("_", " ")
    value = re.sub(r"[^A-Z0-9#-]+", " ", value)
    words = [COMMON_CORRECTIONS.get(word, word) for word in value.split()]
    return " ".join(words)


def load_visual_lines(label: str, path: Path) -> list[dict]:
    with path.open(encoding="utf-8", errors="replace") as stream:
        rows = [
            row
            for row in csv.DictReader(stream, delimiter="\t")
            if (row.get("text") or "").strip() and float(row.get("conf") or -1) >= 0
        ]

    words = []
    for row in rows:
        left = int(row["left"])
        top = int(row["top"])
        width = int(row["width"])
        height = int(row["height"])
        words.append(
            {
                "text": row["text"].strip(),
                "left": left,
                "top": top,
                "right": left + width,
                "bottom": top + height,
                "center": top + height / 2,
                "height": height,
            }
        )

    visual_lines: list[dict] = []
    for word in sorted(words, key=lambda item: (item["center"], item["left"])):
        best = None
        best_distance = float("inf")
        for line in visual_lines:
            distance = abs(word["center"] - line["center"])
            # P&ID symbols can create very tall OCR boxes. A fixed visual-line
            # tolerance prevents those boxes from merging neighboring rows.
            tolerance = 12
            if distance <= tolerance and distance < best_distance:
                best = line
                best_distance = distance
        if best is None:
            visual_lines.append(
                {"source": label, "words": [word], "center": word["center"], "height": word["height"]}
            )
        else:
            best["words"].append(word)
            best["center"] = sum(item["center"] for item in best["words"]) / len(best["words"])
            best["height"] = max(item["height"] for item in best["words"])

    results = []
    for line in visual_lines:
        ordered = sorted(line["words"], key=lambda item: item["left"])
        results.append(
            {
                "source": label,
                "text": " ".join(item["text"] for item in ordered),
                "bbox": [
                    min(item["left"] for item in ordered),
                    min(item["top"] for item in ordered),
                    max(item["right"] for item in ordered),
                    max(item["bottom"] for item in ordered),
                ],
            }
        )
    return results


def term_score(term: str, line: str) -> float:
    if term in line:
        return 1.0
    compact_term = term.replace(" ", "")
    compact_line = line.replace(" ", "")
    if compact_term in compact_line:
        return 0.98
    candidates = line.split()
    if not candidates:
        return 0.0
    return max(SequenceMatcher(None, term, candidate).ratio() for candidate in candidates)


def score(query: str, text: str) -> float:
    query_terms = normalize(query).split()
    line = normalize(text)
    if not query_terms or not line:
        return 0.0
    return sum(term_score(term, line) for term in query_terms) / len(query_terms)


def main() -> None:
    parser = argparse.ArgumentParser(description="P&ID OCR TSV를 좌표와 함께 느슨하게 검색합니다.")
    parser.add_argument("query", help='검색어. 예: "VIBRO FEEDER"')
    parser.add_argument("--limit", type=int, default=8, help="표시할 최대 후보 수")
    args = parser.parse_args()

    missing = [str(path.relative_to(ROOT)) for _, path in SOURCES if not path.exists()]
    if missing:
        raise SystemExit(
            "OCR 파일이 없습니다. 먼저 ./scripts/build-ocr-assets.sh 를 실행해 주세요.\n- "
            + "\n- ".join(missing)
        )

    normalized_query = normalize(args.query)
    query_terms = normalized_query.split()
    minimum_score = 0.86 if len(query_terms) == 1 else 0.75
    candidates = []
    for label, path in SOURCES:
        for line in load_visual_lines(label, path):
            line["score"] = score(args.query, line["text"])
            if line["score"] >= minimum_score:
                candidates.append(line)

    candidates.sort(key=lambda item: item["score"], reverse=True)
    if not candidates:
        print("검색 후보를 찾지 못했습니다. 단어를 줄이거나 부분 확대 OCR을 다시 확인해 주세요.")
        return

    for index, item in enumerate(candidates[: args.limit], start=1):
        bbox = ", ".join(str(value) for value in item["bbox"])
        print(f"{index}. [{item['score']:.2f}] {item['source']} · bbox [{bbox}]")
        print(f"   {item['text']}")


if __name__ == "__main__":
    main()

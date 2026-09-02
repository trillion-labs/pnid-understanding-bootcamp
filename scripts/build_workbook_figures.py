#!/usr/bin/env python3
import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "figures"


def esc(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def label(x, y, value, size=22, weight=400, anchor="start", color="#182237"):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" fill="{color}">{esc(value)}</text>'


def write_trillion_summary() -> None:
    values = [("Single image", 0.554), ("Split image", 0.623), ("Zoom", 0.656), ("Split + zoom", 0.688)]
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="700" viewBox="0 0 1400 700">',
        '<rect width="1400" height="700" fill="#fbfcfe"/>',
        '<style>text{font-family:AppleGothic,"Apple SD Gothic Neo",sans-serif}</style>',
        label(70, 72, "같은 P&ID도 이미지 전달 방식에 따라 결과가 달라졌습니다", 36, 500),
        label(70, 112, "Trillion Labs 내부 실험 · Gemini 3.5 Flash · OVERALL score", 18, color="#5e6c82"),
    ]
    x0, y0, maxw = 350, 175, 780
    for i, (name, value) in enumerate(values):
        y = y0 + i * 88
        width = value / 0.72 * maxw
        color = "#315efb" if i == 3 else "#7f91aa"
        parts += [
            label(70, y + 35, name, 23, 500 if i == 3 else 400),
            f'<rect x="{x0}" y="{y}" width="{maxw}" height="48" fill="#e9eef5"/>',
            f'<rect x="{x0}" y="{y}" width="{width:.1f}" height="48" fill="{color}"/>',
            label(x0 + width + 16, y + 34, f"{value:.3f}", 22, 500, color=color),
        ]
    parts += [
        label(70, 570, "핵심 메시지", 20, 500, color="#315efb"),
        label(220, 570, "한 장을 그대로 주는 것보다, 나누고 필요한 곳을 확대했을 때 전체 점수가 높았습니다.", 21, 500),
        label(70, 612, "단, 일부 문제 유형은 오히려 하락했습니다. 따라서 ‘항상 분할’이 아니라 질문별 검증이 필요합니다.", 18, color="#5e6c82"),
        label(70, 666, "내부 사례 · 동일 Gemini judge · 표본 수와 불확실성 구간은 export에 기재되지 않았습니다.", 14, color="#778399"),
        '</svg>',
    ]
    (OUT / "trillion-labs-image-input-summary.svg").write_text("\n".join(parts), encoding="utf-8")


def write_actual_runs() -> None:
    summary = ROOT / "experiments" / "single-image-prompt" / "results" / "deep-reading-v2" / "summary.csv"
    with summary.open(encoding="utf-8") as stream:
        rows = list(csv.DictReader(stream))
    models = [("claude", "sonnet", "Claude Sonnet"), ("codex", "luna", "Codex Luna"), ("codex", "terra", "Codex Terra")]
    conditions = [("full-short", "전체 + 짧은 질문"), ("crop-short", "부분 확대 + 짧은 질문"), ("crop-guided", "부분 확대 + 근거 확인 질문")]
    score = {(r["provider"], r["model"], r["condition"]): int(r["evidence_score"]) for r in rows}
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="680" viewBox="0 0 1400 680">',
        '<rect width="1400" height="680" fill="#fbfcfe"/>',
        '<style>text{font-family:AppleGothic,"Apple SD Gothic Neo",sans-serif}</style>',
        label(70, 72, "실제 CLI 실행: 부분 확대만으로는 충분하지 않았습니다", 36, 500),
        label(70, 112, "단일 도면 이해 질문 · 본문 비교 9회 · 근거 검토 점수(4점 만점)", 18, color="#5e6c82"),
    ]
    left, top, cellw, cellh = 390, 180, 280, 90
    for j, (_, title) in enumerate(conditions):
        parts.append(label(left + j * cellw + cellw / 2, top - 25, title, 18, 500, anchor="middle"))
    for i, (provider, model, title) in enumerate(models):
        y = top + i * cellh
        parts.append(label(70, y + 55, title, 22, 500))
        for j, (condition, _) in enumerate(conditions):
            value = score[(provider, model, condition)]
            x = left + j * cellw
            palette = ["#e35d6a", "#e8a458", "#80a6b8", "#315efb", "#2346b8"]
            color = palette[value]
            parts += [
                f'<rect x="{x}" y="{y}" width="{cellw-12}" height="{cellh-12}" fill="{color}" opacity="0.92"/>',
                label(x + (cellw-12)/2, y + 51, f"{value} / 4", 26, 500, anchor="middle", color="#ffffff"),
            ]
    parts += [
        label(70, 510, "관찰 1", 18, 500, color="#315efb"),
        label(165, 510, "부분 확대 이미지는 태그를 키웠지만, 하단 연결 방향을 잘못 해석하는 답은 줄지 않았습니다.", 19),
        label(70, 550, "관찰 2", 18, 500, color="#315efb"),
        label(165, 550, "확인 순서는 motor와 joint 구분을 도왔지만 연결 관계 판단을 자동으로 해결하지는 못했습니다.", 19),
        label(70, 620, "점수는 제공된 기준 답안에 따른 수동 검토입니다. 전체 응답과 CLI 사용량은 실험 폴더에 보존했습니다.", 14, color="#778399"),
        '</svg>',
    ]
    (OUT / "actual-cli-image-prompt-comparison.svg").write_text("\n".join(parts), encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write_trillion_summary()
    write_actual_runs()
    print(OUT)


if __name__ == "__main__":
    main()

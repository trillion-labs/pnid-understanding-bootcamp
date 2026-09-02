#!/usr/bin/env python3
import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "figures" / "trillion-labs-image-input-strategy.svg"


def esc(text: str) -> str:
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def text(x, y, value, size=22, weight=400, anchor="start", fill="#172033"):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" fill="{fill}">{esc(value)}</text>'


def main() -> None:
    overall_path = ROOT / "data" / "trillion-labs" / "image-input-overall.csv"
    axis_path = ROOT / "data" / "trillion-labs" / "axis-single-vs-splitzoom.csv"
    with overall_path.open(encoding="utf-8") as f:
        overall = list(csv.DictReader(f))
    with axis_path.open(encoding="utf-8") as f:
        axes = list(csv.DictReader(f))

    W, H = 1600, 1000
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
        '<rect width="1600" height="1000" fill="#fbfcfe"/>',
        '<style>text{font-family:AppleGothic,"Apple SD Gothic Neo",sans-serif}.num{font-variant-numeric:tabular-nums}</style>',
        text(70, 70, "같은 P&ID, 다른 이미지 입력: 성능은 얼마나 달라질까?", 38, 500),
        text(70, 108, "Trillion Labs 내부 실험 · Gemini 3.5 Flash · reasoning 8K · 최대 20 turns", 19, 400, fill="#526077"),
    ]

    # Panel A: bars
    ax, ay, aw, ah = 70, 165, 710, 365
    parts += [f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" fill="#ffffff" stroke="#cbd3df"/>',
              text(ax + 24, ay + 38, "A. 입력 전략별 OVERALL score", 23, 500)]
    ordered = sorted(overall, key=lambda r: float(r["overall"]))
    label_x, bar_x, bar_w = ax + 24, ax + 225, 430
    y0, gap = ay + 76, 39
    minv, maxv = 0.45, 0.72
    for i, row in enumerate(ordered):
        y = y0 + i * gap
        v = float(row["overall"])
        width = max(0, (v - minv) / (maxv - minv) * bar_w)
        highlight = row["strategy"] in {"splitzoom-highres", "zoom-lowres"}
        color = "#315efb" if highlight else ("#7d8ca3" if row["turn_mode"] == "single-turn" else "#5aa7a7")
        parts += [text(label_x, y + 18, row["strategy"], 16),
                  f'<rect x="{bar_x}" y="{y}" width="{bar_w}" height="24" fill="#edf1f7"/>',
                  f'<rect x="{bar_x}" y="{y}" width="{width:.1f}" height="24" fill="{color}"/>',
                  text(bar_x + width + 8, y + 18, f'{v:.3f}', 16, 500, fill=color)]
    parts += [text(ax + aw - 20, ay + ah - 15, "높을수록 좋음", 14, anchor="end", fill="#657189")]

    # Panel B: pixel efficiency scatter
    bx, by, bw, bh = 820, 165, 710, 365
    parts += [f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="#ffffff" stroke="#cbd3df"/>',
              text(bx + 24, by + 38, "B. 픽셀 투입량과 성능", 23, 500)]
    px0, py0, pw, ph = bx + 72, by + 66, 585, 235
    parts += [f'<line x1="{px0}" y1="{py0+ph}" x2="{px0+pw}" y2="{py0+ph}" stroke="#98a4b7"/>',
              f'<line x1="{px0}" y1="{py0}" x2="{px0}" y2="{py0+ph}" stroke="#98a4b7"/>']
    for t in [0, 10, 20, 30, 40]:
        x = px0 + t / 40 * pw
        parts += [f'<line x1="{x}" y1="{py0+ph}" x2="{x}" y2="{py0+ph+6}" stroke="#98a4b7"/>', text(x, py0+ph+26, str(t), 13, anchor="middle", fill="#657189")]
    for t in [0.54, 0.58, 0.62, 0.66, 0.70]:
        y = py0 + ph - (t - 0.52) / 0.20 * ph
        parts += [f'<line x1="{px0-6}" y1="{y}" x2="{px0}" y2="{y}" stroke="#98a4b7"/>', text(px0-10, y+5, f'{t:.2f}', 13, anchor="end", fill="#657189")]
    scatter = [r for r in overall if r["total_mp"]]
    for row in scatter:
        xval, yval = float(row["total_mp"]), float(row["overall"])
        x = px0 + xval / 40 * pw
        y = py0 + ph - (yval - 0.52) / 0.20 * ph
        highlight = row["strategy"] == "splitzoom-highres"
        color = "#315efb" if highlight else "#5aa7a7"
        radius = 10 if highlight else 7
        parts += [f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{color}" stroke="#ffffff" stroke-width="3"/>',
                  text(x + 10, y - 10, row["strategy"], 14, 500 if highlight else 400, fill=color)]
    parts += [text(px0 + pw/2, by + bh - 18, "총 입력 픽셀 (MP)", 15, anchor="middle", fill="#526077"),
              f'<text x="{bx+20}" y="{py0+ph/2}" font-size="15" fill="#526077" transform="rotate(-90 {bx+20} {py0+ph/2})" text-anchor="middle">OVERALL score</text>']

    # Panel C: deltas
    cx, cy, cw, ch = 70, 565, 1460, 340
    parts += [f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" fill="#ffffff" stroke="#cbd3df"/>',
              text(cx + 24, cy + 40, "C. Split+zoom − Single high-res: 문제 유형별 변화", 23, 500)]
    zero_x, scale = cx + 650, 1800
    top, row_gap = cy + 70, 30
    parts += [f'<line x1="{zero_x}" y1="{top-10}" x2="{zero_x}" y2="{top+row_gap*len(axes)-4}" stroke="#7d8ca3" stroke-width="1.5"/>']
    for i, row in enumerate(axes):
        y = top + i * row_gap
        d = float(row["delta"])
        w = abs(d) * scale
        x = zero_x if d >= 0 else zero_x - w
        color = "#315efb" if d >= 0 else "#e05a67"
        parts += [text(cx + 30, y + 17, row["axis"], 15),
                  f'<rect x="{x}" y="{y}" width="{w:.1f}" height="20" fill="{color}"/>',
                  text((x+w+8) if d>=0 else (x-8), y+16, f'{d:+.3f}', 14, 500, "start" if d>=0 else "end", color)]
    parts += [text(cx + 30, cy + ch - 18, "대부분의 유형은 개선됐지만 material·multihop은 하락 → 입력 전략은 문제 유형에 따라 검증해야 함", 16, 500, fill="#526077")]

    parts += [
        f'<line x1="70" y1="938" x2="1530" y2="938" stroke="#d3dae5"/>',
        text(70, 967, "Source: 제공된 Trillion Labs 내부 실험 메모. Judge도 Gemini 3.5 Flash이며 source가 judge bias 가능성을 명시.", 14, fill="#657189"),
        text(70, 990, "표본 수·불확실성 구간은 export에 없어 독립 benchmark가 아닌 사례 연구로 해석.", 14, fill="#657189"),
        '</svg>'
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()

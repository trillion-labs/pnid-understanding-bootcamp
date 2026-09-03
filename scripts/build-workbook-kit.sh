#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

command -v python3 >/dev/null || {
  echo "필요한 명령을 찾지 못했습니다: python3" >&2
  exit 1
}

python3 <<'PY'
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path.cwd()
output = root / "public" / "downloads" / "pnid-ai-workbook-kit.zip"
output.parent.mkdir(parents=True, exist_ok=True)

items = [
    root / "실습자료",
    root / "workbook-kit" / "README.md",
    root / "scripts" / "run-workbook-cli.sh",
    root / "scripts" / "build-ocr-assets.sh",
    root / "scripts" / "search_ocr.py",
    root / "data" / "ocr" / "pnid-user-words.txt",
    root / "data" / "ocr" / "sample-pid-full-improved.tsv",
    root / "data" / "ocr" / "feeder-c-area-improved.tsv",
    root / "data" / "ocr" / "sample-pid-ocr.txt",
]

with ZipFile(output, "w", ZIP_DEFLATED) as archive:
    for item in items:
        paths = item.rglob("*") if item.is_dir() else [item]
        for path in paths:
            if not path.is_file():
                continue
            relative = (
                Path("README.md")
                if path == root / "workbook-kit" / "README.md"
                else path.relative_to(root)
            )
            archive.write(path, Path("pnid-ai-workbook-kit") / relative)

print(f"Created {output}")
PY

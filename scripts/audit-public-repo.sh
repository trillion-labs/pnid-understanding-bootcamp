#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

tracked_files=$(git ls-files --cached)

if grep -Eq '^(source|tmp|output|workshop)/' <<<"$tracked_files"; then
  echo "공개하면 안 되는 폴더의 파일이 Git에 포함되어 있습니다." >&2
  grep -E '^(source|tmp|output|workshop)/' <<<"$tracked_files" >&2
  exit 1
fi

public_pdfs=$(grep -E '\.pdf$' <<<"$tracked_files" || true)
unexpected_pdfs=$(grep -v '^assets/ocr/sample-pid-searchable-improved.pdf$' <<<"$public_pdfs" || true)
if [[ -n "$unexpected_pdfs" ]]; then
  echo "검토되지 않은 PDF가 Git에 포함되어 있습니다." >&2
  echo "$unexpected_pdfs" >&2
  exit 1
fi

if git grep --cached -n -I -E '/Users/scottsuk|hyunseong|MAGALDI|DONGHAE|STX Heavy|DAELIM|MHI CO|BHI_SCOPE' -- . ':(exclude)scripts/audit-public-repo.sh' >/tmp/pnid-public-audit.txt; then
  echo "로컬 경로나 원본 메타데이터 문자열이 공개 파일에 남아 있습니다." >&2
  cat /tmp/pnid-public-audit.txt >&2
  exit 1
fi

for required in \
  assets/full/J-11520-ZM-105-005_page-001.png \
  assets/overview/sample-pid-overview-1600.png \
  assets/regions/R06-title-block.png \
  assets/ocr/sample-pid-searchable-improved.pdf \
  data/redaction.json; do
  [[ -f "$required" ]] || {
    echo "필수 비식별 자산이 없습니다: $required" >&2
    exit 1
  }
done

author=$(pdfinfo assets/ocr/sample-pid-searchable-improved.pdf | sed -n 's/^Author:[[:space:]]*//p')
title=$(pdfinfo assets/ocr/sample-pid-searchable-improved.pdf | sed -n 's/^Title:[[:space:]]*//p')
if [[ -n "$author" || -n "$title" ]]; then
  echo "공개 OCR PDF에 원본 Author 또는 Title 메타데이터가 남아 있습니다." >&2
  exit 1
fi

echo "READY: 공개 저장소에 비공개 원본·로컬 경로·검토되지 않은 PDF가 없습니다."

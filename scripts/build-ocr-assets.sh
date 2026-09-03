#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

for command_name in tesseract pdftotext; do
  command -v "$command_name" >/dev/null || {
    echo "필요한 명령을 찾지 못했습니다: $command_name" >&2
    echo "macOS: brew install tesseract poppler" >&2
    echo "Ubuntu/WSL: sudo apt install -y tesseract-ocr poppler-utils" >&2
    echo "설치한 뒤 이 스크립트를 다시 실행해 주세요." >&2
    exit 1
  }
done

full_image="실습자료/이미지/원본-고해상도-도면.png"
zoom_image="실습자료/이미지/feeder-c-원본-확대.png"
user_words="data/ocr/pnid-user-words.txt"
pdf_base="실습자료/ocr/검색가능한-pnid"
full_tsv_base="data/ocr/sample-pid-full-improved"
zoom_tsv_base="data/ocr/feeder-c-area-improved"

mkdir -p 실습자료/ocr data/ocr public/downloads

common_options=(
  -l eng
  --dpi 300
  --user-words "$user_words"
  -c thresholding_method=2
  -c preserve_interword_spaces=1
)

# 전체 P&ID에는 라벨이 흩어져 있어 sparse text 모드가 더 잘 맞고,
# 잘라낸 확대 이미지는 하나의 텍스트 블록으로 처리합니다.
full_layout_options=(--psm 11)
zoom_layout_options=(--psm 6)

keep_word_rows() {
  local tsv_path=$1
  local temp_path="${tsv_path}.tmp"
  awk -F '\t' 'BEGIN { OFS="\t" } NR == 1 || ($1 == 5 && $12 != "")' "$tsv_path" > "$temp_path"
  mv "$temp_path" "$tsv_path"
}

echo "1/4 전체 도면 searchable PDF를 만듭니다."
tesseract "$full_image" "$pdf_base" "${common_options[@]}" "${full_layout_options[@]}" pdf

echo "2/4 전체 도면 OCR 좌표를 만듭니다."
tesseract "$full_image" "$full_tsv_base" "${common_options[@]}" "${full_layout_options[@]}" tsv
keep_word_rows "$full_tsv_base.tsv"

echo "3/4 Feeder #C 확대 이미지 OCR 좌표를 만듭니다."
tesseract "$zoom_image" "$zoom_tsv_base" "${common_options[@]}" "${zoom_layout_options[@]}" tsv
keep_word_rows "$zoom_tsv_base.tsv"

echo "4/4 PDF 검색 텍스트를 추출합니다."
pdftotext "$pdf_base.pdf" "data/ocr/sample-pid-ocr.txt"
cp "$pdf_base.pdf" public/downloads/sample-pid-ocr.pdf

echo
echo "완료했습니다."
echo "PDF: $pdf_base.pdf"
echo "전체 OCR: $full_tsv_base.tsv"
echo "부분 확대 OCR: $zoom_tsv_base.tsv"

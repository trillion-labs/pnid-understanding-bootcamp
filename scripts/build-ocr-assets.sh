#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

for command_name in tesseract pdftotext; do
  command -v "$command_name" >/dev/null || {
    echo "필요한 명령을 찾지 못했습니다: $command_name" >&2
    exit 1
  }
done

full_image="assets/full/J-11520-ZM-105-005_page-001.png"
zoom_image="assets/regions/feeder-c-area.png"
user_words="data/ocr/pid-user-words.txt"
pdf_base="assets/ocr/sample-pid-searchable-improved"
full_tsv_base="data/ocr/sample-pid-full-improved"
zoom_tsv_base="data/ocr/feeder-c-area-improved"

mkdir -p assets/ocr data/ocr

common_options=(
  -l eng
  --psm 6
  --dpi 300
  --user-words "$user_words"
  -c thresholding_method=2
  -c preserve_interword_spaces=1
)

keep_word_rows() {
  local tsv_path=$1
  local temp_path="${tsv_path}.tmp"
  awk -F '\t' 'BEGIN { OFS="\t" } NR == 1 || ($1 == 5 && $12 != "")' "$tsv_path" > "$temp_path"
  mv "$temp_path" "$tsv_path"
}

echo "1/4 전체 도면 searchable PDF를 만듭니다."
tesseract "$full_image" "$pdf_base" "${common_options[@]}" pdf

echo "2/4 전체 도면 OCR 좌표를 만듭니다."
tesseract "$full_image" "$full_tsv_base" "${common_options[@]}" tsv
keep_word_rows "$full_tsv_base.tsv"

echo "3/4 Feeder #C 확대 이미지 OCR 좌표를 만듭니다."
tesseract "$zoom_image" "$zoom_tsv_base" "${common_options[@]}" tsv
keep_word_rows "$zoom_tsv_base.tsv"

echo "4/4 PDF 검색 텍스트를 추출합니다."
pdftotext "$pdf_base.pdf" "data/ocr/sample-pid-searchable-improved.txt"

echo
echo "완료했습니다."
echo "PDF: $pdf_base.pdf"
echo "전체 OCR: $full_tsv_base.tsv"
echo "부분 확대 OCR: $zoom_tsv_base.tsv"

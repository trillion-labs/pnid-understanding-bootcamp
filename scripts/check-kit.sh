#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

for command_name in shasum jq sips awk pdftotext; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "MISSING COMMAND: $command_name"
    exit 1
  fi
done

required_files=(
  "source/sample-pid.pdf"
  "source/private/trillion-labs-agentic-pid-export.zip"
  "workshop/participant-kit/README.md"
  "workshop/participant-kit/MY-WORK.md"
  "workshop/participant-kit/EXTENSIONS.md"
  "workshop/participant-kit/inputs/01-overview.png"
  "workshop/participant-kit/inputs/02-feeder-c-area.png"
  "workshop/participant-kit/inputs/03-query-evidence.png"
  "workshop/participant-kit/inputs/04-searchable.pdf"
  "workshop/participant-kit/inputs/05-e01-text-layer.jsonl"
  "workshop/instructor/reference/PREPARED-RESPONSES.md"
  "workshop/instructor/reference/EXPECTED-WORK.md"
  "data/document.json"
  "data/regions.jsonl"
  "data/objects.example.jsonl"
  "data/redaction.json"
  "data/ocr/sample-pid-ocr.tsv"
  "data/ocr/e01-text-layer.example.jsonl"
  "data/real-queries.jsonl"
  "data/benchmark-cases.jsonl"
  "data/trillion-labs/image-input-overall.csv"
  "data/trillion-labs/axis-single-vs-splitzoom.csv"
  "output/pdf/sample-pid-searchable.pdf"
  "skills/pid-visual-evidence/SKILL.md"
  "skills/pid-visual-evidence/references/output-contract.md"
  "experiments/skill-ab/run-matrix.csv"
  "experiments/skill-ab/existing-q005-results.csv"
  "experiments/improvement-loop/iteration-log.csv"
  "scripts/score_skill_experiment.py"
  "assets/figures/trillion-labs-image-input-summary.png"
  "assets/figures/actual-cli-image-prompt-comparison.png"
  "data/image-cost-estimates.csv"
  "experiments/single-image-prompt/results/verifiable-v3/summary.csv"
  "experiments/single-image-prompt/results/verifiable-v3/manual-review.csv"
  "scripts/run_single_image_prompt_experiment.sh"
  "scripts/build_image_input_figure.py"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "MISSING: $file"
    exit 1
  fi
done

expected_sha="15e99bc0f1df2ba816150f2ddbb8c19c2513d1628afa9d69efe7b41a6d8810cc"
actual_sha=$(shasum -a 256 source/sample-pid.pdf | awk '{print $1}')
if [[ "$actual_sha" != "$expected_sha" ]]; then
  echo "SOURCE CHECKSUM MISMATCH"
  exit 1
fi

jq empty data/document.json
for file in data/*.jsonl data/ocr/*.jsonl templates/*.jsonl; do
  while IFS= read -r line; do
    printf '%s\n' "$line" | jq empty
  done < "$file"
done

check_size() {
  local file=$1
  local expected_width=$2
  local expected_height=$3
  local width
  local height
  width=$(sips -g pixelWidth "$file" | awk '/pixelWidth/ {print $2}')
  height=$(sips -g pixelHeight "$file" | awk '/pixelHeight/ {print $2}')
  if [[ "$width" != "$expected_width" || "$height" != "$expected_height" ]]; then
    echo "IMAGE SIZE MISMATCH: $file is ${width}x${height}, expected ${expected_width}x${expected_height}"
    exit 1
  fi
}

check_size workshop/participant-kit/inputs/01-overview.png 1600 1132
check_size workshop/participant-kit/inputs/02-feeder-c-area.png 1330 1710
check_size workshop/participant-kit/inputs/03-query-evidence.png 1330 1710
check_size assets/figures/trillion-labs-image-input-summary.png 1400 700
check_size assets/figures/actual-cli-image-prompt-comparison.png 1400 680

searchable_lines=$(pdftotext -layout output/pdf/sample-pid-searchable.pdf - | wc -l | awk '{print $1}')
if [[ "$searchable_lines" -le 0 ]]; then
  echo "SEARCHABLE PDF HAS NO TEXT LAYER"
  exit 1
fi

echo "OK: required files"
echo "OK: source checksum"
echo "OK: JSON and JSONL syntax"
echo "OK: prepared image dimensions"
echo "OK: searchable PDF text layer (${searchable_lines} extracted lines)"
echo "READY: workshop kit passed all checks"

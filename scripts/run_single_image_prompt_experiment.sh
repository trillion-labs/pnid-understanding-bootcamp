#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

out_dir="experiments/single-image-prompt/results/verifiable-v3/raw"
mkdir -p "$out_dir"

full_image="$repo_dir/assets/overview/sample-pid-overview-1600.png"
crop_image="$repo_dir/assets/regions/feeder-c-area-long-edge-1600.png"
short_prompt=$(<experiments/single-image-prompt/prompts/short.txt)
guided_prompt=$(<experiments/single-image-prompt/prompts/guided.txt)

run_claude() {
  local model=$1
  local model_label=$2
  local condition=$3
  local image=$4
  local prompt=$5
  local output="$out_dir/claude-${model_label}-${condition}.json"
  local image_prompt
  image_prompt="Read the image file at $image using the Read tool, then answer this Korean prompt:\n\n$prompt"
  claude -p "$image_prompt" \
    --model "$model" \
    --effort medium \
    --allowedTools Read \
    --permission-mode dontAsk \
    --no-session-persistence \
    --max-budget-usd 0.30 \
    --output-format json > "$output"
}

run_codex() {
  local model=$1
  local model_label=$2
  local condition=$3
  local image=$4
  local prompt=$5
  local output="$out_dir/codex-${model_label}-${condition}.jsonl"
  codex exec \
    --model "$model" \
    --image "$image" \
    --sandbox read-only \
    --ephemeral \
    --skip-git-repo-check \
    --json \
    --cd "$repo_dir" \
    "$prompt" > "$output"
}

condition=${1:-all}
case "$condition" in
  full-short)
    run_claude sonnet sonnet full-short "$full_image" "$short_prompt" &
    run_codex gpt-5.6-luna luna full-short "$full_image" "$short_prompt" &
    run_codex gpt-5.6-terra terra full-short "$full_image" "$short_prompt" &
    wait
    ;;
  crop-short)
    run_claude sonnet sonnet crop-short "$crop_image" "$short_prompt" &
    run_codex gpt-5.6-luna luna crop-short "$crop_image" "$short_prompt" &
    run_codex gpt-5.6-terra terra crop-short "$crop_image" "$short_prompt" &
    wait
    ;;
  crop-guided)
    run_claude sonnet sonnet crop-guided "$crop_image" "$guided_prompt" &
    run_codex gpt-5.6-luna luna crop-guided "$crop_image" "$guided_prompt" &
    run_codex gpt-5.6-terra terra crop-guided "$crop_image" "$guided_prompt" &
    wait
    ;;
  all)
    "$0" full-short
    "$0" crop-short
    "$0" crop-guided
    ;;
  *)
    echo "usage: $0 [full-short|crop-short|crop-guided|all]" >&2
    exit 2
    ;;
esac

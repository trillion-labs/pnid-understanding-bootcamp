#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

usage() {
  cat <<'EOF'
사용법
  ./scripts/run-workbook-cli.sh <도구> <조건>

도구
  claude       Claude Sonnet
  codex-luna   Codex GPT-5.6 Luna
  codex-terra  Codex GPT-5.6 Terra

조건
  full          전체 구조용 이미지 + 짧은 질문
  zoom          Feeder #C 주변 확대 이미지 + 짧은 질문
  zoom-guided   Feeder #C 주변 확대 이미지 + 단계별 질문

예시
  ./scripts/run-workbook-cli.sh claude full
  ./scripts/run-workbook-cli.sh codex-luna zoom
EOF
}

if [[ ${1:-} == "--help" || ${1:-} == "-h" ]]; then
  usage
  exit 0
fi

agent=${1:-}
condition=${2:-}

if [[ -z "$agent" || -z "$condition" ]]; then
  usage >&2
  exit 2
fi

case "$condition" in
  full)
    image_path="실습자료/이미지/전체-도면.png"
    prompt_path="실습자료/프롬프트/기본-질문.txt"
    ;;
  zoom)
    image_path="실습자료/이미지/feeder-c-확대.png"
    prompt_path="실습자료/프롬프트/기본-질문.txt"
    ;;
  zoom-guided)
    image_path="실습자료/이미지/feeder-c-확대.png"
    prompt_path="실습자료/프롬프트/단계별-질문.txt"
    ;;
  *)
    echo "알 수 없는 조건입니다: $condition" >&2
    usage >&2
    exit 2
    ;;
esac

case "$agent" in
  claude)
    command -v claude >/dev/null || {
      echo "claude 명령을 찾지 못했습니다. Claude Code 설치와 로그인을 먼저 확인해 주세요." >&2
      exit 1
    }
    provider="claude"
    model="sonnet"
    ;;
  codex-luna)
    command -v codex >/dev/null || {
      echo "codex 명령을 찾지 못했습니다. Codex CLI 설치와 로그인을 먼저 확인해 주세요." >&2
      exit 1
    }
    provider="codex"
    model="gpt-5.6-luna"
    ;;
  codex-terra)
    command -v codex >/dev/null || {
      echo "codex 명령을 찾지 못했습니다. Codex CLI 설치와 로그인을 먼저 확인해 주세요." >&2
      exit 1
    }
    provider="codex"
    model="gpt-5.6-terra"
    ;;
  *)
    echo "알 수 없는 도구입니다: $agent" >&2
    usage >&2
    exit 2
    ;;
esac

output_dir="$repo_dir/output/workbook-cli"
mkdir -p "$output_dir"
timestamp=$(date +%Y%m%d-%H%M%S)
output_path="$output_dir/${timestamp}-${agent}-${condition}.txt"

echo "도구: $agent"
echo "모델: $model"
echo "이미지: $image_path"
echo "질문: $prompt_path"
echo "결과 저장: $output_path"
echo

if [[ "$provider" == "claude" ]]; then
  instruction="Read the image file at $repo_dir/$image_path with the Read tool. Then read $repo_dir/$prompt_path and answer that Korean prompt. Do not modify any files."
  claude -p "$instruction" \
    --model "$model" \
    --effort medium \
    --allowedTools Read \
    --permission-mode dontAsk \
    --no-session-persistence \
    --max-budget-usd 0.30 \
    --output-format text | tee "$output_path"
else
  codex exec \
    --model "$model" \
    --image "$image_path" \
    --sandbox read-only \
    --ephemeral \
    -C "$repo_dir" \
    --output-last-message "$output_path" \
    "$(<"$prompt_path")"
fi

echo
echo "완료했습니다. 결과 파일: $output_path"

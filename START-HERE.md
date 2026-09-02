# 여기서 시작하세요

이 프로젝트는 두 가지 방식으로 사용할 수 있습니다.

## 처음부터 차근차근 읽고 싶다면

[워크북 안내](docs/00-course-design-principles.md)에서 시작해 주세요. P&ID가 무엇인지, 현업 질문을 어떻게 읽는지, 실제 Claude Code/Codex 결과가 어떻게 달라졌는지 순서대로 설명합니다.

권장 독서 순서는 [README](README.md)의 `참가자 학습 순서`에 정리되어 있습니다.

## 짧은 실습을 바로 진행하고 싶다면

이 실습은 파일 변환이나 좌표 측정부터 시작하지 않습니다. 필요한 이미지는 모두 `workshop/participant-kit/inputs/`에 준비되어 있습니다.

## 참가자가 열 파일은 두 개뿐입니다

1. [따라 하기 안내서](workshop/participant-kit/README.md)
2. [내 실습 기록지](workshop/participant-kit/MY-WORK.md)

실습은 다음 한 Loop를 완주합니다.

```text
도면 읽기 -> Feeder #C 관련 질문 채점 -> 오류 원인 분류
  -> 데이터/도구/스킬 중 하나 개선 -> 같은 조건 재평가
    -> Claude Code/Codex 결과 비교
```

## 처음 나오는 말

| 용어 | 이 과정에서 뜻하는 것 |
|---|---|
| Baseline | 개선하기 전 결과. 나쁜 결과라는 뜻이 아님 |
| Evidence | AI 답을 원본에서 다시 확인할 수 있는 글자·심벌·위치 근거 |
| Benchmark | 같은 현업 질문과 채점 기준으로 여러 실행을 비교하는 시험판 |
| Improvement Loop | 오류를 찾고 한 가지를 바꾼 뒤 같은 조건으로 다시 시험하는 과정 |
| Bbox / 위치 상자 | 근거가 이미지 어디에 있는지 저장하는 사각형 주소 |
| Structured data | 같은 종류의 정보를 같은 칸에 넣어 검색·비교 가능하게 만든 결과 |

## 사용할 준비 파일

| 순서 | 파일 | 역할 |
|---|---|---|
| 1 | `inputs/01-overview.png` | 전체 구조만 보는 저해상도 지도 |
| 2 | `inputs/02-feeder-c-area.png` | 실제 Q005의 Reception Bin 2 / Feeder #C 확대본 |
| 3 | `inputs/03-query-evidence.png` | 두 현업 질문의 근거 구역 표시본 |
| 선택 | `inputs/04-searchable.pdf` | OCR text layer 확장 실습용 PDF |
| 선택 | `inputs/05-e01-text-layer.jsonl` | R02 E01의 OCR 낱말·위치 확장 예시 |

네 개의 `optional-q*.png`는 시간이 남을 때 사용하는 겹침 사분면 자료입니다.

## 강사가 수업 전에 할 일

터미널에서 다음 명령 한 번만 실행합니다.

```bash
./scripts/check-kit.sh
```

마지막 줄에 `READY: workshop kit passed all checks`가 나오면 준비가 끝난 것입니다.

## 도구가 작동하지 않아도 수업을 계속할 수 있습니다

Claude 또는 Codex의 이미지 업로드가 되지 않거나 응답이 늦으면 [강사용 준비 응답](workshop/instructor/reference/PREPARED-RESPONSES.md)을 보여 주고 검토 활동부터 이어갑니다.

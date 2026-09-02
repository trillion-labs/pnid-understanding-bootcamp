# Exercises

## 01 File inspection

원본을 수정하지 않고 메타데이터, 체크섬, 텍스트 추출 여부를 `output/participant-id/01-file-inspection.md`에 기록한다.

## 02 Region annotation

할당된 영역을 crop하고 region bbox를 `regions.jsonl` 한 행으로 기록한다. crop의 픽셀 크기가 bbox width/height와 일치해야 한다.

## 03 Object annotation

장비 object 3개 이상을 표시하고 local/global bbox를 모두 기록한다. overlay 스크린샷을 함께 제출한다.

## 04 Agent review

Extractor와 다른 에이전트 또는 새 컨텍스트를 Reviewer로 사용한다. `templates/review.md`로 판정을 기록한다.

## 05 Evaluation and iteration

Gold와 prediction을 비교하고 오류 taxonomy를 적용한다. 프롬프트 또는 전처리를 한 번 바꾼 뒤 수정 전후 결과를 비교한다.

## 제출 구조

```text
output/participant-id/
  01-file-inspection.md
  regions.jsonl
  objects.jsonl
  relations.jsonl
  overlay.png
  agent-log.md
  review.md
  evaluation.csv
  error-analysis.md
```

# 단일 도면 이미지와 프롬프트 비교 실험

현재 본문에서 사용하는 기준 실험은 `strict/`입니다. P&ID 한 장에서 Reception Bin 2 태그, A측 밸브, Feeder #C 태그와 전동기 태그를 얼마나 정확히 읽는지 확인합니다.

1. 같은 질문을 전체 도면과 Feeder #C 주변 확대 이미지에 사용하면 결과가 어떻게 달라집니까?
2. 같은 이미지에서 짧은 질문과 단계별 확인 질문을 사용하면 결과가 어떻게 달라집니까?

본문 비교 모델:

- Claude Sonnet
- GPT-5.6 Luna
- GPT-5.6 Terra

실행 조건:

- `full-short`: 전체 도면과 짧은 질문
- `crop-short`: Feeder #C 주변 확대 이미지와 같은 짧은 질문
- `crop-guided`: 같은 확대 이미지와 단계별 확인 질문

모든 실행은 새 읽기 전용 세션을 사용합니다. 현재 기준 실험은 네 조건을 세 모델에서 한 번씩 실행한 12개 결과로 구성됩니다.

현재 재현 스크립트는 지정된 이미지를 최초 입력으로 불러오는 동작만 허용하고, 입력 후 추가 파일 읽기, 확대·자르기·리사이즈, OCR, 코드 실행과 외부 검색을 프롬프트에서 금지합니다. `strict/summary.csv`의 `tool_attempts`는 Codex 이벤트 로그에서만 집계하며, Claude는 허용된 `Read` 호출 횟수가 최종 JSON에 포함되지 않아 빈값으로 남깁니다.

- 현재 기준 실험: `strict/`
- 제한 강화 전 기록: `baseline/`
- 원본 해상도 전체 도면 실험: `fullres/`
- 확대 이미지 크기 정규화 실험: `normalized/`
- 이전 탐색 실험: `deep-reading/`, `retrieval/`

공개 실습 키트 ZIP에는 현재 본문의 근거로 사용하는 `strict/README.md`, `strict/summary.csv`와 `strict/manual-review.csv`만 포함합니다. 로컬 경로나 검토 전 응답이 섞일 수 있는 `raw/`와 이전 탐색 실험은 공개 ZIP에서 제외합니다.

`fullres/`는 4,963×3,509 원본 해상도 이미지에 대한 이전 탐색 결과입니다. 일부 실행에서 OCR이나 부분 자르기를 사용했으므로 현재 무도구 기준 점수에는 포함하지 않습니다.

경로는 짧고 안정적인 이름을 사용합니다. `strict`는 현재 `strict-v1`, 기존 `baseline`은 `verifiable-v3`, `fullres`는 `fullres-v1`, `normalized`는 `normalized-crop-v1`에 해당합니다.

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

공개 실습 키트 ZIP에는 현재 본문의 근거로 사용하는 `strict/README.md`, `strict/summary.csv`와 `strict/manual-review.csv`만 포함합니다. 로컬 경로나 검토 전 응답이 섞일 수 있는 `raw/`는 공개 ZIP에서 제외합니다.

현재 실험 프로토콜 버전은 `strict-v1`입니다.

# 단일 도면 이미지와 프롬프트 비교 실험

현재 본문에서 사용하는 기준 실험은 `baseline/`입니다. P&ID 한 장에서 Reception Bin 2 태그, A측 밸브, Feeder #C 태그와 전동기 태그를 얼마나 정확히 읽는지 확인합니다.

1. 같은 질문을 전체 도면과 Feeder #C 주변 확대 이미지에 사용하면 결과가 어떻게 달라집니까?
2. 같은 확대 이미지에서 짧은 질문과 단계별 확인 질문을 사용하면 결과가 어떻게 달라집니까?

본문 비교 모델:

- Claude Sonnet
- GPT-5.6 Luna
- GPT-5.6 Terra

실행 조건:

- `full-short`: 전체 도면과 짧은 질문
- `crop-short`: Feeder #C 주변 확대 이미지와 같은 짧은 질문
- `crop-guided`: 같은 확대 이미지와 단계별 확인 질문

모든 실행은 새 읽기 전용 세션을 사용합니다.

- 기준 실험: `baseline/`
- 원본 해상도 전체 도면 실험: `fullres/`
- 확대 이미지 크기 정규화 실험: `normalized/`
- 이전 탐색 실험: `deep-reading/`, `retrieval/`

`fullres/`는 4,963×3,509 원본 해상도 이미지를 한 장 그대로 입력했을 때의 결과입니다. 세 모델 모두 네 항목을 정확히 확인했으며, `summary.csv`에는 항목별 점수와 실행 중 추가 확인 여부를 기록했습니다. 이 결과는 본문의 1,600px 전체 구조용 이미지 실험을 대체하지 않고, 입력 해상도가 판독 결과에 미치는 영향을 후속 비교하기 위한 기준으로 사용합니다.

경로는 짧고 안정적인 이름을 사용합니다. 기존 실험 버전은 `baseline`이 `verifiable-v3`, `fullres`가 `fullres-v1`, `normalized`가 `normalized-crop-v1`에 해당합니다.

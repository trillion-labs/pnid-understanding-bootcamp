# 이미지 입력 전략 그래프 데이터

이 폴더에는 이미지 입력 전략 단원의 비교 그래프에 사용한 정리 데이터가 있습니다.

기록된 실험 조건은 다음과 같습니다.

- 모델: Gemini 3.5 Flash
- reasoning budget: 8K
- 최대 turn: 20
- judge: Gemini 3.5 Flash

원자료에는 표본 수, 불확실성 구간과 독립 재현 결과가 없습니다. 답변 채점에도 같은 Gemini 모델이 사용되었으므로 범용 모델 벤치마크가 아니라 이미지 입력 방식에 따른 사례 비교로만 해석합니다.

- `image-input-overall.csv`: 입력 전략별 전체 점수와 이미지 픽셀 비교
- `axis-single-vs-splitzoom.csv`: 단일 고해상도 입력과 분할·확대 입력의 항목별 비교

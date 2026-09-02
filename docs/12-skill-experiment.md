# 12. 스킬을 추가하고 전후를 비교하는 실습

## 실습 목표

프롬프트 한 번을 잘 쓰는 것과, 반복되는 작업 방식을 스킬로 저장하는 것의 차이를 경험합니다.

스킬은 정답을 외우는 파일이 아니다. 다음처럼 여러 P&ID 질의에서 반복되는 판단 기준을 보존합니다.

- filename/catalog은 후보 축소이지 component 존재 증명이 아님
- overview에서는 작은 태그를 읽지 않음
- query term을 확인하는 crop만 선택
- observed text와 inferred component를 분리
- drawing 정답과 evidence 정답을 따로 평가
- 미확인 term을 `unknown`으로 유지

## 만든 스킬

- 경로: `skills/pid-visual-evidence/`
- 진입점: `skills/pid-visual-evidence/SKILL.md`
- 출력 계약: `skills/pid-visual-evidence/references/output-contract.md`
- 검증 상태: `quick_validate.py` 통과

## 왜 스킬을 짧게 만들었는가

OpenAI 공식 지침은 leaner prompt가 성능과 token 효율을 개선할 수 있으므로 중복 지침을 제거하고 대표 eval로 검증하라고 권장합니다. 스킬에는 P&ID 작업에서 실제 결정을 바꾸는 지침만 넣었다.

Anthropic 공식 지침은 vision 작업에 crop tool 또는 agent skill을 제공할 때 관련 영역을 zoom할 수 있어 image evaluation이 개선됐다고 설명합니다. 동시에 과도한 tool 지시와 over-prompting은 피하라고 안내합니다.

따라서 스킬은 `항상 4분할`, `항상 OCR`, `반드시 bbox`처럼 고정하지 않습니다. task mode와 근거 수준에 따라 필요한 도구만 선택합니다.

## 60분 과정에 넣는 방법

### 1. 스킬 없이 Q005 실행

fresh session에서 query 원문만 실행합니다. 결과를 저장합니다.

### 2. 스킬을 읽는다

참가자는 SKILL.md에서 다음을 찾는다.

- 언제 이 스킬이 사용되는가?
- 무엇을 하지 않는가?
- 어느 단계에서 crop을 선택하는가?
- 완료 전 무엇을 확인하는가?

### 3. 스킬을 사용해 동일 Q005 실행

fresh session을 다시 시작합니다. query, 모델, effort, 시간 제한은 그대로 두고 스킬만 추가합니다.

### 4. drawing과 evidence를 따로 채점한다

도면 ID만 맞았는지, 근거 component까지 맞았는지 분리합니다.

### 5. 스킬을 한 줄만 개선한다

실제 오류가 있었을 때만 수정합니다. 예를 들어 motor tag를 expansion joint로 오인했다면 `E-MT/EM은 motor evidence` 구분을 추가합니다. 일반적인 장문 지침을 더하지 않습니다.

## 직접 실행하기

실행 순서와 CSV는 `experiments/skill-ab/`에 있습니다.

- `run-matrix.csv`: 앞으로 실행할 8개 행
- `existing-q005-results.csv`: GS Agent 기존 run 6개 입력 완료
- `README.md`: 실행·채점 절차
- `scripts/score_skill_experiment.py`: 점수 자동 계산

## 결과 입력 원칙

- 실행 직후 usage와 경로를 기록합니다.
- token 필드가 제공되지 않으면 비워 둔다.
- 모델 UI가 보여 준 값과 추정값을 섞지 않습니다.
- raw response와 trace를 보존합니다.
- 사람이 evidence를 검토하기 전에 total score를 해석하지 않습니다.

## 학습 질문

1. 스킬이 drawing 정답률을 높였는가?
2. 스킬이 evidence 위치를 더 많이 남겼는가?
3. 스킬이 component 오인을 줄였는가?
4. tool call과 token은 늘었는가, 줄었는가?
5. 추가 비용만큼 검증 가능한 결과가 늘었는가?
6. 스킬의 어떤 한 줄이 실제 행동을 바꿨는가?

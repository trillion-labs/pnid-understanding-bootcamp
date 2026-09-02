# 07. 강사용 60분 진행안

## 수업의 중심 질문

> 큰 P&ID 한 장을 AI에게 한 번에 물으면 왜 잘못 읽고, 입력 이미지와 질문 순서를 어떻게 바꾸면 더 근거 있는 결과를 얻을 수 있을까?

60분 동안 모든 데이터를 완성하려 하지 않습니다. 동일한 AI가 `자유로운 탐색형 질문`과 `전체→확대→검증 질문`에서 어떻게 달라지는지 참가자가 직접 보게 하는 것이 핵심입니다. 둘 중 하나를 무조건 우수하다고 가르치지 않고 목적 적합성을 비교합니다.

## 수업 전 필수 준비

- `source/sample-pid.pdf`
- 전체 도면 이미지 `assets/full/J-11520-ZM-105-005_page-001.png`
- Feeder #C Feeder #C 주변 부분 확대 이미지 `assets/regions/feeder-c-area.png`
- query evidence 예시 `assets/bbox/feeder-c-query-evidence.png`
- Claude 또는 Codex에서 이미지를 입력할 수 있는 환경
- baseline 결과를 저장할 빈 문서
- 개선 결과를 저장할 빈 문서

로그인, 업로드 권한, 모델 응답 지연은 수업 전에 확인합니다. 도구가 작동하지 않을 때 보여 줄 baseline과 개선 결과 스크린샷도 미리 준비합니다.

## 0~5분: 오늘의 결과를 보여 준다

강사가 먼저 두 결과를 나란히 보여 준다.

- A: 전체 도면 + `이 도면을 분석해 줘`
- B: 전체 지도 → Feeder #C Feeder #C 주변 확대 → 확인 항목 확인 → 원본 재검증

참가자에게 묻는다.

- 어느 답이 더 길어 보이는가?
- 어느 답이 원본에서 다시 확인하기 쉬운가?
- 어느 답이 모르는 것을 모른다고 말하는가?

강사 메시지:

> 오늘은 AI에게 더 많은 답을 받는 법이 아니라, 확인 가능한 답을 받는 법을 배웁니다.

## 5~12분: P&ID를 처음 보는 법

[P&ID 아주 짧은 입문](00-pid-primer.md)의 다섯 가지 중 다음만 화면에서 찾는다.

1. 오른쪽 아래 제목란
2. 오른쪽 위 범례
3. 중앙의 Reception Bin 1, 2, 3
4. 장비를 연결하는 선
5. 작은 원형 계기

용어를 외우게 하지 않습니다. 참가자가 화면에서 위치를 가리킬 수 있으면 통과다.

확인 질문:

- P&ID는 실제 거리와 배치를 정확히 그린 지도인가? → 아니오
- 선이 교차하면 항상 연결인가? → 아니오
- 흐린 태그를 문맥으로 채워도 되는가? → 아니오

## 12~20분: baseline 만들기

전체 이미지를 가벼운 모델 또는 사용할 모델에 입력합니다.

baseline 프롬프트:

> 이 P&ID에서 Vibro Feeder #C를 찾아 주세요. 장비 태그, 바로 위쪽에 연결된 장비, 아래쪽 출구 연결, Expansion Joint와 관련하여 확인되는 내용과 확인할 수 없는 내용을 설명해 주세요.

응답을 고치지 말고 그대로 저장합니다. 다음 네 항목에 표시합니다.

| 질문 | 예 / 아니오 / 모름 |
|---|---|
| 이 도면을 관련 있다고 판단했는가? |  |
| 위치 근거를 남겼는가? |  |
| #C와 outlet joint를 확인했는가, 추측했는가? |  |
| 판독 불가를 표시했는가? |  |

이 단계의 목적은 모델이나 짧은 프롬프트를 낮게 평가하는 것이 아니다. 탐색형 질문이 발견한 내용과, 근거·형식이 필요한 추출 질문의 결과가 어떻게 다른지 비교할 기준점을 만드는 것입니다.

## 20~28분: 전체 이미지를 지도처럼 읽힌다

같은 전체 이미지를 사용하되 역할과 범위를 제한합니다.

> 이 이미지는 전체 구조를 파악하기 위한 저해상도 지도다. 작은 태그를 추측해 읽지 마. Feeder #C의 Vibro Feeder와 Reception Bin 반복 구조를 찾고, #C와 outlet joint를 확인하려면 어느 구역을 확대해야 하는지 위치와 함께 설명해.

참가자에게 baseline과 비교하게 합니다.

- 질문 대상이 줄었는가?
- 위치 표현이 생겼는가?
- 작은 글자 추측이 줄었는가?

이 시점에 `assets/figures/trillion-labs-image-input-summary.png`를 2분간 보여 줍니다.

강사 메시지:

> Trillion Labs 내부 실험에서도 single-highres 0.554, split-lowres 0.623, split+zoom 0.688로 입력 방식에 따라 결과가 달랐습니다. 하지만 material과 multihop은 오히려 하락했습니다. 그래서 항상 분할하는 규칙이 아니라 질문별 A/B 평가가 필요합니다.

동일 Gemini judge와 표본 수 미기재라는 한계를 함께 말합니다.

강사는 4사분면 방식을 1분 안에 소개합니다.

> 큰 도면은 네 조각으로 나눌 수 있지만 경계가 잘리지 않도록 서로 10~15% 겹치게 합니다. 이 샘플에서는 기계적인 사분면보다 Feeder #C의 Reception Bin 2 / Feeder #C 같은 query 구역 부분 확대 이미지을 사용합니다.

## 28~36분: Feeder #C 확대본을 확인 항목 중심으로 읽힌다

Feeder #C 주변 부분 확대 이미지을 입력합니다.

![Feeder #C 주변 Feeder #C 확대본](../assets/regions/feeder-c-area.png)

프롬프트:

> 이 부분 확대 이미지은 전체 도면의 Reception Bin 2 주변 Feeder #C 주변입니다. Feeder #C의 `VIBRO FEEDER #C`, `11520-M-VB-03C`, outlet joint 문맥을 하나씩 확인해. 각 term을 확인됨/판독 불가로 나누고 보이는 글자와 위치를 적어. E-MT/EM은 motor evidence이므로 expansion-joint tag로 자동 해석하지 마.

강사 설명:

- 확인 항목을 하나씩 확인하는 것이 이번 pass의 범위다.
- drawing ID를 맞히는 것과 component 근거를 맞히는 것은 다른 평가다.
- motor와 joint 의미를 분리하면 근거 오류를 찾기 쉬워진다.

## 36~43분: 근거 구역을 위치 상자로 이해한다

전문 용어부터 말하지 않습니다.

1. 빨간 사각형을 보여 준다.
2. `AI가 말한 대상이 그림의 어디인지 남기는 위치 상자`라고 설명합니다.
3. 그 다음 이름이 bounding box, 줄여서 bbox라고 알려 준다.

![Feeder #C/Flexible Hose 근거 구역](../assets/bbox/feeder-c-query-evidence.png)

Feeder #C의 파란 근거 구역을 사용합니다. 이것은 개별 객체를 타이트하게 감싼 객체 위치 상자가 아니라 query 근거를 함께 검토하는 넓은 구역입니다.

```text
왼쪽 위 점: (220, 1030)
오른쪽 아래 점: (750, 1550)
bbox: [220, 1030, 750, 1550]
```

이 시간에는 좌표를 직접 측정하거나 IoU를 계산하지 않습니다. `이 파란 상자가 Feeder #C의 어떤 근거를 함께 보여 주는지` 설명할 수 있으면 충분하다.

## 43~50분: 에이전트에게 데이터 한 행을 맡긴다

강사는 표를 보여 주기 전에 이유를 묻는다.

> AI가 `이 도면이 관련 있습니다`라고 문장으로 답했습니다. 이런 답이 100개가 되면 어떤 확인 항목을 확인했고 무엇을 추측했는지 어떻게 비교할까요?

참가자 답을 들은 뒤 설명합니다.

> 같은 정보를 같은 칸에 넣으면 종류별 검색, 누락 검사, 모델 비교, 재확대가 가능해집니다. 이것이 구조화 데이터입니다. 오늘은 JSON이 아니라 표 한 행만 만듭니다.

프롬프트:

> Feeder #C 주변 이미지의 파란 근거 구역 `[220,1030,750,1550]`에서 Feeder #C required term을 검토해. query_term, observed_text, inferred_component, evidence_region, status, note 열을 가진 표로 작성해. 읽히지 않는 값은 unknown으로 두고, 마지막에 motor evidence와 joint evidence를 혼동하지 않았는지 확인해.

참가자는 결과에서 다음을 찾는다.

- 목표: Feeder #C required term 확인
- 입력: Feeder #C 주변 이미지와 근거 구역
- 규칙: 추측 금지
- 출력: query evidence 표
- 검사: component 의미 재확인

## 50~54분: 전체 이미지로 돌아가 검토하고 채점한다

검토 프롬프트:

> 새로운 term을 추가하지 마. 방금 만든 Feeder #C evidence 행만 Feeder #C 주변 확대 이미지와 전체 이미지에서 다시 확인해. `확인됨 / 수정 필요 / 판독 불가` 중 하나로 판정하고, 어떤 글자·심벌과 어느 근거 구역을 근거로 삼았는지 적어.

검토 기준:

- 확인됨: 글자, 대상, 위치 상자를 직접 확인
- 수정 필요: 대상은 있으나 글자·종류·상자가 틀림
- 판독 불가: 현재 이미지로 확정할 수 없음

`AI가 앞에서 그렇게 말했다`는 근거가 아니다.

강사는 drawing 정답과 evidence 정답을 분리해 채점합니다.

| 영역 | 빠른 확인 |
|---|---|
| Retrieval | 올바른 drawing ID인가? 추가 ID는 없는가? |
| Evidence | 확인 항목과 위치 근거가 있는가? component를 혼동하지 않았는가? |
| Behavior | 판독 불가를 추측하지 않았는가? |

시간과 token은 품질 점수에 더하지 않습니다. 품질이 비슷한 run끼리 효율을 비교합니다.

## 54~58분: 개선 Loop를 한 번 돌린다

준비된 Feeder #C 개선 전 결과에서 가장 큰 오류 하나를 고른다.

```text
오류: E-MT-18을 expansion joint로 오인
원인 후보: component evidence 검토 지침 부족
변경: pid-visual-evidence 스킬 규칙 한 줄 추가
```

새 session에서 같은 Feeder #C를 다시 실행합니다. 응답 시간이 부족하면 강사가 미리 실행한 개선 후 결과를 사용합니다.

개선 전와 개선 후에서 drawing score, evidence score, component error, tool/time/token만 비교합니다. 한 번에 데이터와 모델과 스킬을 함께 바꾸지 않습니다.

## 58~60분: Claude Code와 Codex 결과를 읽고 회고한다

강사가 미리 채운 `experiments/skill-ab/run-matrix.csv` 또는 `experiments/improvement-loop/iteration-log.csv`를 보여 준다.

같아야 하는 것:

- query
- source data와 gold version
- skill version
- fresh session
- output contract와 reviewer

제품별로 기록할 것:

- 정확한 model name과 effort
- available tools
- skill load mode
- usage reporting 방식

참가자가 두 문장을 완성합니다.

참가자가 두 문장을 완성합니다.

1. 전체 도면에서는 ______만 먼저 보고, 작은 글자는 ______에서 본다.
2. AI 결과를 믿기 전에 ______를 원본에서 다시 확인합니다.

권장 답:

1. 전체 구조 / 고해상도 확대본
2. 글자와 위치 근거

## 시간이 남을 때 선택할 확장 활동

강사가 현장에서 하나를 고른다.

- 같은 Feeder #C 주변에서 Flexible Hose Flexible Hose/OFA 근거 관찰
- 같은 부분 확대 이미지에서 계기만 찾는 두 번째 pass
- 10~15% 겹침이 있는 사분면 예시 만들기
- Claude와 Codex의 같은 프롬프트 결과 비교
- local bbox와 global bbox 변환
- JSONL 한 줄 작성
- 검토자를 새 대화로 분리
- Feeder #C/Flexible Hose benchmark case 추가
- 같은 모델에서 데이터 구조만 바꾸어 재평가
- 같은 데이터에서 스킬 전/후 재평가

## 시간이 부족할 때 줄이는 순서

1. baseline 실행을 미리 저장한 스크린샷으로 대체합니다.
2. 4사분면 설명을 한 문장으로 줄인다.
3. 좌표 숫자는 읽지 않고 위치 상자 개념만 보여 준다.
4. 참가자 입력 대신 강사 데모로 실행합니다.

P&ID 입문, coarse-to-fine 비교, 원본 근거 검토는 생략하지 않습니다.

## 강사 품질 체크

- [ ] 전문 용어를 사용하기 전에 쉬운 말로 먼저 설명했다.
- [ ] P&ID 전문 교육과 AI 데이터 처리 교육의 경계를 말했다.
- [ ] 전체 이미지와 확대 이미지의 역할을 다르게 설명했다.
- [ ] 4사분면에는 겹침이 필요하다고 설명했다.
- [ ] 한 pass에 한 종류만 요청했다.
- [ ] unknown을 좋은 결과로 인정했다.
- [ ] AI 응답 길이가 아니라 근거 가능성을 비교했다.
- [ ] 마지막에 전체 이미지로 돌아가 검토했다.
- [ ] drawing 정답과 evidence 정답을 분리해 채점했다.
- [ ] 개선 Loop에서 한 번에 한 변수만 바꿨다.
- [ ] Claude Code/Codex 비교 조건을 함께 기록했다.

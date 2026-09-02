# 완성된 실습 기록 예시

이 문서는 참가자가 막혔을 때 일부만 보여 주는 참고 답안입니다. 처음부터 전체를 배포하면 비교와 검토 경험이 사라질 수 있습니다.

## 1단계

- [x] 오른쪽 아래 제목란
- [x] 오른쪽 위 범례
- [x] 중앙의 Reception Bin 1, 2, 3

## 2단계

| 질문 | 판정 | 근거 예시 |
|---|---|---|
| 이 도면을 Feeder #C와 관련 있다고 판단했는가? | 예 | bottom ash와 feeder 언급 |
| 위치 근거를 남겼는가? | 아니오 | 중앙·오른쪽 같은 위치가 없음 |
| #C와 outlet joint를 확인했는가, 추측했는가? | 모름 | 실제 baseline 응답에 따라 판단 |
| 판독 불가를 표시했는가? | 아니오 | 불확실성 표현이 없음 |

## 3단계

> 지도 프롬프트에서는 제목란, 범례, 반복 구조의 위치와 다음 확대 구역이 분리되어 나왔다.

## 4단계

| Query term | 상태 | 보이는 근거 | 위치 |
|---|---|---|---|
| VIBRO FEEDER #C | 확인됨 | VIBRO FEEDER #C / 11520-M-VB-03C | Feeder #C 주변 파란 구역 |
| outlet joint | 검토 필요 | joint 심벌 후보 | Feeder #C 주변 파란 구역 |

## 5단계

- 파란 상자가 가리키는 대상: Feeder #C feeder #C와 outlet 근거 문맥
- bbox: `[220,1030,750,1550]`
- Feeder #C 근거를 검토하기에 충분한가? 예

## 6단계

| query_term | observed_text_or_symbol | inferred_component | evidence_region | status | note |
|---|---|---|---|---|---|
| VIBRO FEEDER #C | VIBRO FEEDER #C / 11520-M-VB-03C | vibro_feeder | Feeder #C 주변 blue | confirmed | tag 직접 확인 |
| outlet joint | joint 심벌 후보 | unknown | Feeder #C 주변 blue | needs_review | motor와 joint 구분 필요 |

- 목표: Feeder #C required term 확인
- 입력 또는 대상: Feeder #C 주변 이미지와 근거 구역
- 규칙: 읽히지 않는 값은 unknown, 추측 금지
- 출력 형식: query evidence 표
- 완료 전 검사: motor와 joint evidence를 혼동하지 않았는지 확인

## 7단계

- AI 판정: 확인됨
- 내 판정: 확인됨
- 이미지 근거: 파란 상자 안 VIBRO FEEDER #C와 11520-M-VB-03C
- motor와 joint를 구분했는가? 예
- 서로 다르면 그 이유: 해당 없음

## 8~10단계

- Quality score: 8/10 예시 - outlet joint ID는 검토 필요
- 개선 대상: component evidence 규칙
- 한 가지 변경: E-MT/EM motor evidence 구분을 스킬에 추가
- Claude Code/Codex 비교: 같은 query, source, gold, skill version을 사용

## 11단계

전체 도면에서는 `큰 구조와 확대할 위치`만 먼저 본다.

작은 글자는 `고해상도 확대본`에서 본다.

AI 결과를 믿기 전에 `글자와 위치 상자`를 원본에서 다시 확인합니다.

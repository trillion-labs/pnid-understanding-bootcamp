# 강사용 준비 응답

도구가 작동하지 않거나 시간이 부족할 때 화면에 보여 줄 수 있는 기준 자료다. 실제 Claude/Haiku의 고정 응답을 가장한 문서가 아니라, 수업 진행을 위한 `대표 응답 예시`다. 모델의 실제 출력은 실행마다 달라질 수 있습니다.

## A. baseline 대표 응답

```text
이 도면은 Bottom Ash Handling System의 P&ID로 보입니다.
여러 개의 reception bin, feeder, pulverizer와 공기 배관 및 계기들이 연결되어 있습니다.
따라서 Vibro Feeder #C Outlet 문제와 관련 있을 가능성이 있습니다.
다만 전체 이미지에서는 #C와 expansion joint를 명확히 확인하기 어렵습니다.
```

강사 관찰:

- Feeder #C 관련 가능성은 설명하지만 discriminating term의 위치 근거가 약하다.
- 어떤 글자를 실제로 읽었는지와 일반 지식으로 해석했는지 구분되지 않습니다.
- 작은 태그를 구체적으로 만들지 않았다는 점은 긍정적입니다.
- 참가자의 실제 baseline이 이것보다 좋거나 나빠도 정상입니다.

## B. 전체 지도 프롬프트 대표 응답

| 위치 | 관찰 | 다음 행동 |
|---|---|---|
| 오른쪽 아래 | 제목란과 revision 정보 | 확대해 문서 식별 정보 확인 |
| 오른쪽 위 | 장비 심벌 범례 | 심벌 해석 시 대조 |
| 중앙 | Reception Bin 1, 2, 3으로 보이는 반복 구조 | #C feeder 후보가 있는 Bin 2 주변 확대 |
| 하단 | feeder와 pulverizer로 이어지는 반복 구조 | 연결선은 확대본과 전체본에서 재확인 |

```text
작은 계기 태그는 현재 overview에서 확정하지 않았습니다.
Feeder #C의 #C feeder를 확인하려면 Reception Bin 2 주변 Feeder #C 주변을 확대해야 합니다.
```

강사 관찰:

- 분석 범위가 큰 구조로 제한되었다.
- 위치와 다음 행동이 있어 검증 계획을 세울 수 있습니다.
- 작은 태그를 읽지 않은 것이 성공입니다.

## C. Feeder #C 주변 Feeder #C 확인 항목 대표 응답

| Query term | 확인 상태 | 보이는 근거 | 위치 |
|---|---|---|---|
| VIBRO FEEDER #C | 확인됨 | VIBRO FEEDER #C | Feeder #C 주변 파란 구역 |
| 11520-M-VB-03C | 확인됨 | feeder 이름 아래 tag | Feeder #C 주변 파란 구역 |
| outlet joint context | 검토 필요 | feeder 아래쪽 joint 심벌 후보 | Feeder #C 주변 파란 구역 |

```text
E-MT-18과 EM 표기는 feeder motor evidence로 보이며 expansion-joint tag로 확정하지 않았습니다.
```

## D. 구조화된 Feeder #C evidence 대표 응답

| query_term | observed_text_or_symbol | inferred_component | evidence_region | status | note |
|---|---|---|---|---|---|
| VIBRO FEEDER #C | VIBRO FEEDER #C / 11520-M-VB-03C | vibro_feeder | Feeder #C 주변 blue `[220,1030,750,1550]` | confirmed | tag 직접 확인 |
| outlet joint | joint 심벌 후보 | unknown | Feeder #C 주변 blue `[220,1030,750,1550]` | needs_review | motor 표기와 분리 검토 |

자체 검사:

```text
파란 근거 구역은 feeder #C, tag와 outlet 문맥을 함께 포함합니다.
E-MT-18은 motor evidence이므로 expansion-joint tag로 사용하지 않았습니다.
```

## E. 검토 대표 응답

```text
판정: 확인됨
근거: Feeder #C 주변 파란 구역에서 `VIBRO FEEDER #C`와 `11520-M-VB-03C`를 확인했다.
제한: outlet joint 심벌의 정확한 component ID는 현재 이미지에서 확정하지 않아 needs_review로 남겼다.
```

## 참가자 결과가 기준과 다를 때

정답 문장을 맞히게 하지 않습니다. 다음 순서로 질문합니다.

1. 그 값은 이미지 어디에서 보이나요?
2. 직접 본 글자와 해석한 내용을 나눌 수 있나요?
3. 현재 부분 확대 이미지으로 확인할 수 없는 부분은 무엇인가요?
4. 새 값을 만들지 않고 기존 행만 다시 검토할 수 있나요?

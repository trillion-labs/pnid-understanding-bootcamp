# 11. 실제 GS Agent 쿼리로 검증하기

## 결론

`gs-agent-pnid-eval`에서 현재 샘플 도면 `J-11520-ZM-105-005`를 정답으로 요구하는 실제 질의 두 개가 확인됐다.

| ID | 난이도 | 질의 핵심 | 기대 도면 |
|---|---|---|---|
| Q005 | easy | Bottom Ash Vibro Feeder #C Outlet Expansion Joint Ash Leak | J-11520-ZM-105-005 |
| Q008 | medium | Reception Bin-2 to OFA Line Flexible Hose Pinhole / Ash Leak | J-11520-ZM-105-005 |

원본 위치:

- 별도 `gs-agent-pnid-eval` 프로젝트의 `outputs/facilitator-answer-key.jsonl`
- Q005는 같은 프로젝트의 `repo/queries/examples.jsonl`과 참가자 handout에도 포함

교육 프로젝트에는 두 질의를 `data/real-queries.jsonl`로 복사해 두었다.

## 왜 현재 도면 이해 방식과 직접 연결되는가

두 질문 모두 파일명만으로는 Bottom Ash Handling System 1/5~5/5 중 어느 시트인지 확정하기 어렵다.

```text
파일명/카탈로그
  -> Bottom Ash Handling System 5장으로 후보 축소
overview
  -> Reception Bin 반복 구조와 feeder가 있는 시트 후보 파악
R03 확대본
  -> Vibro Feeder #C, Reception Bin 2, Flexible Hose, Boiler OFA 확인
bbox
  -> 답변 근거 위치 고정
구조화 데이터
  -> query term과 관찰 object/text를 비교
```

즉, 이 두 질의는 coarse-to-fine의 효과를 보여 주기 좋은 실제 사례다.

## R03 query evidence crop

기존 입문 실습의 R02는 Reception Bin 1을 설명하기 위한 단순 예다. 실제 Q005와 Q008은 Reception Bin 2가 있는 R03에서 직접 증거를 찾는다.

![R03 실제 쿼리 근거](../assets/bbox/feeder-c-query-evidence.png)

- 빨간 상자: Q008의 `Flexible Hose`, `Reception Bin 2`, `Boiler OFA` 문맥
- 파란 상자: Q005의 `VIBRO FEEDER #C`, `11520-M-VB-03C`, 출구 쪽 joint 심벌 문맥

이 상자는 query evidence를 빠르게 검토하기 위한 넓은 region bbox다. 개별 부품의 최종 gold bbox는 별도 adjudication이 필요합니다.

## 기존 Q005 실행 결과

`repo/viewer/data/runs.json`에서 Q005 관련 run 여섯 개를 확인했다.

| run | 결정 | 정확 | strict single | 시간 | tool calls |
|---|---|---:|---:|---:|---:|
| baseline Claude Sonnet | 005 포함, 추가 후보 존재 | 예 | 아니오 | 190.63s | 27 |
| baseline Claude Haiku | 002 | 아니오 | 아니오 | 130.83s | 15 |
| baseline Codex Luna | 005 | 예 | 예 | 163.26s | 26 |
| baseline Codex Terra | 005 | 예 | 예 | 123.05s | 18 |
| catalog-v1 Codex Luna | 003 | 아니오 | 아니오 | 95.21s | 8 |
| pid-view-v2 Codex Luna | 005 | 예 | 예 | 124.27s | 12 |

관찰:

1. Haiku baseline은 2/5의 일반 expansion joint를 보고 잘못 선택했다.
2. 카탈로그만 제공한 Luna도 3/5를 골라 실패했다.
3. overview와 crop을 사용한 pid-view-v2 Luna는 5/5에서 `VIBRO FEEDER #C`를 확인해 성공했다.
4. 동일한 Codex Luna 비교에서 pid-view-v2는 raw baseline보다 tool call이 26→12, 시간은 163.26→124.27초로 감소했다.
5. 기록된 input token은 840,958→684,239, 추정 비용은 약 9.2% 감소했다. 토큰 집계 방식은 harness에 의존하므로 절대값보다 동일 harness 내 비교로 본다.

## 중요한 반례: 도면을 맞혀도 근거가 틀릴 수 있다

일부 성공 run은 `11520-E-MT-18`을 expansion joint로 표현했다. 그러나 도면에서 `EM` 심벌과 `E-MT-18`은 feeder의 전동기 표기로 보입니다. drawing ID exact match만 채점하면 이런 근거 오류를 놓친다.

따라서 평가를 두 층으로 나눕니다.

### Retrieval 평가

- 올바른 도면 ID를 골랐는가?
- 불필요한 다른 도면 ID를 함께 제시하지 않았는가?

### Evidence 평가

- `VIBRO FEEDER #C`를 실제 crop에서 확인했는가?
- `11520-M-VB-03C`를 올바르게 읽었는가?
- expansion joint와 motor tag를 혼동하지 않았는가?
- Q008에서 Flexible Hose와 Boiler OFA 문맥을 확인했는가?
- 근거 bbox 또는 crop을 남겼는가?

우리 교육의 bbox, text layer, 구조화 데이터는 retrieval보다 evidence 평가에서 더 큰 역할을 합니다.

## text layer가 얼마나 도와주는가

현재 whole-page OCR text layer에서는 다음 문자열이 검색됐다.

- `FLEXIBLE HOSE`
- `BOILER OFA`
- `RECEPTION BIN 2`
- 일부 `VIBRO FEEDER`

하지만 `VIBRO FEEDER #C` 전체와 세부 tag는 안정적으로 추출되지 않았다. 따라서 text layer만으로 Q005를 풀기에는 부족하다.

권장 결합:

```text
OCR text layer로 후보 문서/구역 검색
  -> 고해상도 crop에서 세부 문자 확인
    -> bbox로 evidence 저장
      -> 사람이 심벌과 tag 의미 검토
```

## 권장 A/B 실험

### A: raw query

입력:

- 455개 원본 PDF
- Q005 또는 Q008 원문

출력:

- 도면 ID 하나
- 자유로운 판단 근거

### B: AI-ready query

입력:

- 파일 카탈로그
- 1600px overview
- 필요 시 R03 crop
- OCR text 후보
- 근거를 bbox와 함께 남기는 출력 스키마

출력:

- 도면 ID 하나
- 확인한 query term
- crop/bbox 근거
- 확인하지 못한 term
- evidence review status

## 점수표

| 항목 | 점수 |
|---|---:|
| 기대 도면 ID exact match | 2 |
| 추가 drawing ID 없음 | 1 |
| 핵심 장비/문자 근거 확인 | 2 |
| 근거 위치 crop/bbox 제공 | 2 |
| component 의미 혼동 없음 | 2 |
| 미확인 항목을 추측하지 않음 | 1 |

총 10점입니다. 기존 drawing retrieval 점수만 사용하면 3점까지만 평가하는 셈입니다.

## 예상

coarse-to-fine과 query evidence 스키마는 다음을 개선할 가능성이 높다.

- 1/5~5/5 중 올바른 sheet 선택
- `#C`와 `Reception Bin 2`처럼 작은 구분자의 판독
- 답변 근거의 재검토 가능성
- motor, joint, feeder 같은 component 의미 혼동 발견

다만 실제 개선을 주장하려면 동일 모델, 동일 query, fresh session, 동일 시간 제한으로 A/B를 반복해야 합니다. 현재 자료는 Q005에서 유의미한 선행 증거를 제공하지만 Q008은 별도 실행 비교가 더 필요합니다.

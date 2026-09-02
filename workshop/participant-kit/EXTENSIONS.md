# 선택 확장 실습

핵심 Feeder #C 실습을 마친 뒤 관심 있는 활동만 선택해 진행할 수 있습니다.

## OCR text layer 확인

`inputs/04-searchable.pdf`를 열고 `RECEPTION`을 검색해 봅니다. 원본 PDF에는 검색 가능한 텍스트가 없었지만, 이 사본에는 OCR이 만든 text layer가 있습니다.

`inputs/05-e01-text-layer.jsonl`은 R02의 `RECEPTION + BIN + 1` 낱말 위치를 Reception Bin 1의 객체 위치에 연결한 예시입니다.

검색된다고 정답인 것은 아닙니다. OCR은 선과 심벌을 글자로 잘못 읽을 수 있으므로 최종 확인은 이미지에서 수행합니다.

## 두 번째 현업 질문 Flexible Hose

Feeder #C 주변 확대 이미지는 다른 현업 질문에도 사용할 수 있습니다.

```text
#1BLR MAR System Reception Bin-2 to OFA Line Flexible Hose Pinhole 및 Ash Leak 관련 P&ID를 찾아라.
```

근거 표시 이미지의 빨간 구역에서 `FLEXIBLE HOSE`, `RECEPTION BIN 2`, `BOILER OFA` 문맥을 확인합니다.

자세한 기존 실행 비교는 [GS Agent 실제 쿼리 검증](../../docs/11-real-query-evaluation.md)에 있습니다.

## 네 구역 분할 비교

`optional-q1.png`부터 `optional-q4.png`까지 사용하여 전체 도면을 서로 겹치는 네 구역으로 나누었을 때 어떤 정보가 잘리고 어떤 정보가 커지는지 비교합니다.

다음 질문을 사용해 보세요.

```text
이 이미지는 전체 도면을 나눈 네 구역 가운데 하나입니다.
완전히 보이는 장비와 이미지 경계에서 잘린 장비를 구분해 주세요.
구역 밖으로 이어지는 선은 현재 이미지 안에서 확정하지 말아 주세요.
```

## 스킬 추가 전후 비교

같은 Feeder #C를 새 대화 두 개에서 실행합니다.

1. 스킬 없이 질문 원문만 실행합니다.
2. `pid-visual-evidence` 스킬을 불러온 뒤 같은 질문을 실행합니다.

다음 항목을 비교합니다.

- 선택한 도면번호
- 확인한 질문 단서 수
- 원본 근거 위치 수
- Motor와 Expansion Joint 같은 설비 요소 오인 수
- 실행 시간, tool call, token과 비용

실행 전에 `experiments/skill-ab/run-matrix.csv`의 해당 행을 찾고, 실행 직후 결과를 입력합니다. 자세한 절차는 [스킬 추가 전후 실습](../../docs/12-skill-experiment.md)에 있습니다.

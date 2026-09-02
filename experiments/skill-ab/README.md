# P&ID skill A/B experiment

## 질문

동일 모델이 동일 쿼리를 풀 때 `pid-visual-evidence` 스킬을 사용하면 도면 선택뿐 아니라 근거 정확성, 재현성, 효율이 개선되는가?

## 공식 best-practice 반영

OpenAI 공식 지침은 lean prompt와 필요한 도구만 유지하고, 대표 task에서 성공·근거·토큰·지연·비용을 함께 비교하라고 권장합니다. 한 번에 여러 변경을 섞지 않고 instruction group 하나씩 제거·추가해 다시 평가하는 방식도 권장합니다. [OpenAI model prompting guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)

Anthropic 공식 지침은 명확한 성공 기준, source verification, structured state, 단계별 tool use를 권장합니다. Vision 작업에서는 crop tool 또는 agent skill로 관련 영역을 zoom할 때 image evaluation 성능이 일관되게 향상됐다고 설명합니다. [Anthropic prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

## 최소 실험 8회

| Query | Codex Luna | Claude Haiku |
|---|---|---|
| Q005 | no_skill / skill | no_skill / skill |
| Q008 | no_skill / skill | no_skill / skill |

각 run은 fresh session으로 실행합니다. 대화 기록이나 이전 답을 이어받지 않습니다.

## 고정할 것

- Query text
- 후보 PDF corpus 또는 제공 파일 세트
- 모델과 effort 설정
- 시간 제한과 최대 turn 수
- 출력 요구사항
- 채점자와 gold data version

## 바꿀 것은 하나뿐이다

- `no_skill`: 스킬을 로드하지 않음
- `skill`: `skills/pid-visual-evidence/`를 로드함

모델, 이미지, 시간 제한, 사용자 쿼리를 동시에 바꾸지 않습니다.

## 실행 전

1. `run-matrix.csv`에서 실행할 행을 찾는다.
2. `started_at`을 기록합니다.
3. 새 session을 연다.
4. no_skill에서는 스킬을 로드하지 않습니다.
5. skill에서는 `pid-visual-evidence` 스킬을 로드합니다.
6. 해당 쿼리 원문만 보낸다.

각 run의 원문과 검토 기록은 `RUN-SHEET.md`를 복사해 저장합니다.

스킬 호출 예:

```text
$pid-visual-evidence 보일러 계통에서 Bottom Ash Vibro Feeder #C Outlet Expansion Joint Ash Leak 관련 P&ID를 찾아라.
```

Claude 환경이 agent skill을 직접 가져올 수 있으면 같은 `SKILL.md` 패키지를 사용합니다. 직접 가져올 수 없는 환경이면 SKILL.md를 project instruction으로 제공하고 `skill_load_mode=project_instruction`으로 기록합니다. 두 방식을 한 그룹으로 섞지 않습니다.

## 실행 직후

다음 값을 먼저 기록하고 나중으로 미루지 않습니다.

- status
- decision_drawing_id
- extra_drawing_ids
- duration_sec
- tool_calls
- token/cost fields if available
- raw response path
- trace path

그 다음 reviewer가 evidence 항목을 채운다.

## 근거 채점

### Q005

- `VIBRO FEEDER #C` 확인
- `11520-M-VB-03C` 확인
- outlet joint 문맥 확인
- `11520-E-MT-18`을 expansion joint tag로 오인하지 않음
- 근거 crop 또는 bbox 존재

### Q008

- `RECEPTION BIN 2` 확인
- `FLEXIBLE HOSE` 확인
- `BOILER OFA` 문맥 확인
- 근거 crop 또는 bbox 존재
- 미확인 MAR/unit mapping을 추측하지 않음

## 결과 계산

```bash
python3 scripts/score_skill_experiment.py \
  experiments/skill-ab/run-matrix.csv \
  output/skill-ab/scored-results.csv
```

빈 행은 유지되며 completed 행만 점수가 계산됩니다.

## 해석

- skill 조건이 도면 정답률만 높이고 component 오류를 늘리면 성공이 아니다.
- tool call이나 token이 줄어도 evidence completeness가 낮아지면 성공이 아니다.
- 1회 결과로 모델 일반 성능을 주장하지 않습니다.
- 가능하면 각 조건을 3회 반복하고 평균과 분산을 본다.

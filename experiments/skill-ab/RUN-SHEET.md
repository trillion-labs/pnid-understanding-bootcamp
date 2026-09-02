# Single-run sheet

한 run마다 이 파일을 복사해 `output/skill-ab/responses/<experiment_id>.md`로 저장합니다.

## Configuration

- experiment_id:
- query_id:
- provider:
- model:
- condition: no_skill / skill
- skill_version:
- skill_load_mode: none / agent_skill / project_instruction
- effort:
- fresh_session: true
- started_at:
- finished_at:

## Exact query

```text

```

## Raw final answer

```text

```

## Usage copied from the product

- duration_sec:
- tool_calls:
- input_tokens:
- cached_input_tokens:
- output_tokens:
- cost_usd:
- trace_path:

보이지 않는 usage 값은 추정하지 않고 빈칸으로 둔다.

## Retrieval review

- expected_drawing_id:
- decision_drawing_id:
- extra_drawing_ids:
- drawing_exact:

## Evidence review

| Required term | confirmed / unresolved / contradicted | Source crop/bbox | Note |
|---|---|---|---|
|  |  |  |  |

- confirmed_term_count:
- required_term_count:
- evidence_location_count:
- component_error_count:
- unsupported_claim_count:
- appropriate_unknown_count:

## Reviewer decision

- reviewer:
- review date:
- strongest improvement:
- most important failure:
- skill instruction that affected behavior:
- proposed one-line skill revision:


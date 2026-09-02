# 13. Codex와 Claude best practices를 실습으로 바꾸기

이 문서는 제품별 공식 지침을 그대로 외우는 자료가 아니라, P&ID 실습에서 관찰할 수 있는 행동으로 변환한 것입니다.

## Codex/OpenAI에서 가져온 원칙

공식 OpenAI 모델 가이드는 leaner prompt, 중복 지침 제거, task에 필요한 도구만 노출, 대표 workload에서 반복 eval을 권장합니다. 자율성과 승인 경계를 한 곳에 간결하게 정의하고, call 수 감소는 최종 품질이 유지될 때만 개선으로 보라고 안내합니다. [OpenAI prompting best practices](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)

### P&ID 실습으로 변환

| 원칙 | 실습 행동 |
|---|---|
| Lean prompt | 스킬에는 원본 보존, query-term 검증, evidence 구분만 둠 |
| State once | `추측하지 마`를 여러 문서에서 반복해 system prompt를 비대하게 만들지 않음 |
| Relevant tools | catalog, overview, crop 중 현재 단계에 필요한 것만 사용 |
| Representative eval | Q005/Q008 실제 질의로 no_skill/skill 반복 |
| Quality before efficiency | drawing/evidence 점수가 유지될 때만 token·call 감소를 개선으로 인정 |
| Autonomy boundary | 원본은 read-only, crop·검사 같은 가역 작업은 허용, 안전 판단은 제외 |

## Claude/Anthropic에서 가져온 원칙

Anthropic 공식 가이드는 명확하고 직접적인 지시, 작업 이유와 맥락 제공, relevant/diverse examples, 구조화된 prompt, 명확한 성공 기준과 source verification을 권장합니다. Vision 작업에서는 관련 영역을 zoom할 수 있는 crop tool 또는 agent skill이 image evaluation에서 일관된 향상을 보였다고 설명합니다. [Anthropic prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

### P&ID 실습으로 변환

| 원칙 | 실습 행동 |
|---|---|
| Clear task | `도면 분석` 대신 현재 단계가 지도·추출·검토인지 표시 |
| Explain why | 작은 tag를 overview에서 읽지 않는 이유를 함께 제공 |
| Structured state | confirmed/unresolved query term을 JSON/표로 저장 |
| Source verification | drawing ID를 맞혀도 crop에서 component 근거를 다시 검토 |
| Crop/skill | overview에서 후보 region을 찾고 필요한 부분만 zoom |
| Avoid overtriggering | 항상 crop/OCR을 강제하지 않고 task mode에 따라 선택 |

## 추가 실습 1: prompt diet

목표: 스킬이 길수록 좋은지 검증합니다.

1. 현재 `pid-visual-evidence` 스킬로 Q005를 실행합니다.
2. 같은 의미를 반복하는 instruction 한 그룹을 제거합니다.
3. fresh session에서 다시 실행합니다.
4. drawing, evidence, token, time을 비교합니다.

한 번에 한 그룹만 제거해야 어느 변경이 결과에 영향을 줬는지 알 수 있습니다.

## 추가 실습 2: context를 주는 이유

두 프롬프트를 비교합니다.

A:

```text
overview에서 작은 태그를 읽지 마.
```

B:

```text
이 overview는 전체 구조와 확대 우선순위를 정하는 지도다.
작은 태그는 축소 과정에서 문자가 사라질 수 있으므로 이 단계에서 확정하지 마.
```

단순 금지와 이유가 있는 지시가 unknown 사용과 확대 계획에 어떤 차이를 만드는지 기록합니다.

## 추가 실습 3: 스킬 과적용 찾기

다음 요청에 스킬이 어느 정도 필요할지 판단합니다.

```text
이 도면의 큰 구조를 자유롭게 설명해 줘.
```

탐색형 설명이라면 모든 object bbox와 JSON schema를 강제하지 않는 것이 적절하다. 스킬이 불필요한 산출물을 만들면 overtriggering 또는 over-specification으로 기록합니다.

## 추가 실습 4: 정답과 근거 분리

Q005에서 drawing ID가 맞지만 `E-MT-18`을 expansion joint로 설명한 결과를 검토합니다.

- Retrieval: 정답
- Evidence: component 오류

단일 exact-match 지표가 이 오류를 숨기는지 확인합니다.

## 추가 실습 5: stateful handoff

Extractor가 다음만 저장합니다.

- confirmed terms
- unresolved terms
- inspected regions
- next recommended crop

Reviewer는 원본 대화를 보지 않고 이 state와 source image만 받아 검토합니다. structured state가 handoff에 충분한지 평가합니다.

## 교육 메시지

Codex best practice와 Claude best practice는 서로 반대되지 않습니다. 두 가이드 모두 다음 방향으로 수렴합니다.

```text
목표를 명확히 함
  + 필요한 도구와 맥락만 제공
  + 실제 source에서 검증
  + 대표 task로 반복 평가
  + 품질이 유지될 때만 비용 절감을 개선으로 인정
```

스킬은 이 과정을 재사용하기 위한 작은 instruction package다. 스킬을 추가했다는 사실이 아니라 실제 Q005/Q008 결과가 좋아졌는지가 성공 기준입니다.

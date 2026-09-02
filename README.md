# AI Agent P&ID Data Bootcamp

이 프로젝트는 P&ID를 처음 보는 분이 Claude Code와 Codex로 실제 도면을 읽고, 근거를 기록하고, 현업 질문으로 성능을 평가한 뒤, 한 가지를 개선하여 다시 평가하는 전 과정을 설명하는 워크북입니다.

## 짧은 실습을 바로 시작하려면

- 참가자와 강사 모두 [START-HERE](START-HERE.md)에서 시작합니다.
- 참가자는 [따라 하기 안내서](workshop/participant-kit/README.md)와 [내 실습 기록지](workshop/participant-kit/MY-WORK.md)만 엽니다.
- 강사는 수업 전에 `./scripts/check-kit.sh`를 실행합니다.
- 모델 또는 이미지 업로드가 작동하지 않으면 [준비 응답](workshop/instructor/reference/PREPARED-RESPONSES.md)을 사용합니다.

## 이 워크북에서 도달하는 지점

1. P&ID에서 제목란, 장비, 선, 계기, 태그가 무엇인지 구분합니다.
2. Claude/Codex에게 `목표-입력-규칙-출력-검사`를 포함해 작업을 요청합니다.
3. `C번 Vibro Feeder 출구 연결부의 Ash Leak 관련 도면 찾기`라는 현업 질문에서 `VIBRO FEEDER #C` 근거를 확인합니다. 실험 데이터에서는 이 질문을 Q005라고 부릅니다.
4. 준비된 근거 구역을 같은 열을 가진 표로 기록합니다.
5. AI 결과를 채점하고 오류 하나를 개선한 뒤 같은 조건으로 다시 비교합니다.

워크북 본문은 시간 제한 없이 개념과 실제 결과를 충분히 설명합니다. 60분 과정이 필요할 때에는 `workshop/participant-kit/`과 강사용 runbook에서 필요한 구간을 선택할 수 있습니다.

## 이 저장소에서 배우는 것

1. 실제 현업 질문을 AI agent에게 맡깁니다.
2. 전체 도면과 확대 이미지의 역할을 다르게 사용합니다.
3. AI 답에 원본 근거 위치를 남깁니다.
4. 같은 기준으로 결과를 기록하고 채점합니다.
5. 오류 원인을 분류하고 한 가지를 개선합니다.
6. Claude Code와 Codex를 같은 업무 계약으로 비교합니다.

## 참가자 학습 순서

| 순서 | 문서 | 결과물 |
|---|---|---|
| 1 | [워크북 안내](docs/00-course-design-principles.md) | 현업 질문과 전체 학습 흐름을 이해합니다. |
| 2 | [P&ID 입문](docs/00-pid-primer.md) | 도면 구성요소와 전문가의 판단 순서를 따라갑니다. |
| 3 | [첫 번째 실제 CLI 실험](docs/01-program-design.md) | 전체·crop·프롬프트 조건의 실제 결과를 비교합니다. |
| 4 | [이미지 입력 전략](docs/02-visual-prompting-strategy.md) | 전체 문맥과 세부 확대를 연결하고 비용을 계산합니다. |
| 5 | [위치 상자와 text layer](docs/03-screenshot-and-bbox.md) | AI 답을 원본 위치와 연결합니다. |
| 6 | [구조화 데이터](docs/04-data-schema.md) | AI 답을 검색·비교 가능한 표로 바꿉니다. |
| 7 | [Claude Code와 Codex 운영](docs/05-agent-workflow.md) | 에이전트 업무 계약을 만듭니다. |
| 8 | [평가 기준](docs/06-evaluation.md) | Drawing·Evidence·Behavior·Efficiency를 평가합니다. |
| 9 | [개선 Loop](docs/14-benchmark-improvement-loop.md) | 오류 하나를 개선하고 같은 조건으로 재평가합니다. |

## 강사·확장 자료

| 문서 | 용도 |
|---|---|
| [강사용 60분 진행안](docs/07-workshop-runbook.md) | 분 단위 수업 운영 |
| [프롬프트 카드](docs/08-prompt-cards.md) | 목적별 요청문 |
| [파일과 이미지 준비](docs/09-file-to-image-reference.md) | 렌더링 상세 절차 |
| [GS Agent 실제 질문 검증](docs/11-real-query-evaluation.md) | Feeder #C·Flexible Hose 질문과 기존 run 비교 |
| [스킬 추가 전후 실습](docs/12-skill-experiment.md) | Codex/Claude A/B 8회 실행 |
| [Codex/Claude 원칙 실습](docs/13-codex-claude-best-practices.md) | 공식 지침을 관찰 가능한 실험으로 변환 |

## text layer 확장 자료

- 원본 PDF: `source/sample-pid.pdf` - 텍스트 추출 0줄
- OCR searchable 사본: `output/pdf/sample-pid-searchable.pdf`
- 위치가 포함된 OCR 결과: `data/ocr/sample-pid-ocr.tsv`
- R02의 OCR 낱말 귀속 예시: `data/ocr/e01-text-layer.example.jsonl`

Text layer는 검색 후보를 만드는 확장 실습입니다. 검색 가능하다는 사실이 OCR 내용의 정확성을 보장하지 않습니다.

## 기준 파일

- 교육용 원본 파일명: `source/sample-pid.pdf`
- 실제 도면 식별자: `J-11520-ZM-105-005`, Rev. F
- 렌더링: `assets/full/J-11520-ZM-105-005_page-001.png`
- 전체 구조용 저해상도 overview: `assets/overview/sample-pid-overview-1600.png`
- 겹침이 있는 4사분면: `assets/quadrants/`
- 전체 구역 bbox 예시: `assets/bbox/overview-regions.png`
- 실제 Feeder #C·Flexible Hose 질문 근거 예시: `assets/bbox/feeder-c-query-evidence.png`
- R02 객체 bbox/text layer 예시: `assets/bbox/R02-equipment-example.png` - 확장 참고
- PDF 특성: A3, 1페이지, 270도 회전 메타데이터, 텍스트 레이어 없음

## 비식별 처리

교육·배포용 이미지와 searchable PDF는 오른쪽 아래 회사명, 로고, 주소, 작성·검토자 영역을 불투명 마스크로 제거했습니다. 도면 제목, 도면번호, 시트와 Rev.F는 학습에 필요해 유지했습니다.

- 마스크 명세: `data/redaction.json`
- 교육용 PDF: `output/pdf/sample-pid-searchable.pdf`
- 내부 원본: `source/sample-pid.pdf` - 배포하지 않음
- Trillion Labs 원본 export: `source/private/trillion-labs-agentic-pid-export.zip` - 개인 메타데이터가 있어 배포하지 않음

## 폴더 규칙

```text
source/      수정하지 않는 원본
assets/      전체 이미지, 구역 이미지, bbox 예시
data/        예시 정답과 데이터셋
templates/   참가자가 복사해 사용하는 빈 양식
exercises/   단계별 실습
docs/        강의와 운영 문서
tmp/         다시 만들 수 있는 임시 파일
output/      참가자 또는 에이전트의 최종 결과
```

## 가장 중요한 원칙

AI가 그럴듯하게 말한 값이 아니라, 원본 이미지에서 위치를 다시 확인할 수 있는 값만 데이터로 채택합니다.

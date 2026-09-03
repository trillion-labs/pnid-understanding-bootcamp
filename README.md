# P&ID × AI Agent Workbook

이 프로젝트는 P&ID를 처음 보는 분이 Claude Code와 Codex로 실제 도면을 읽고, 답의 근거를 원본 위치와 연결하고, 결과를 평가한 뒤 한 가지를 개선하여 다시 비교하는 전 과정을 설명하는 워크북입니다.

공개 워크북은 [GitHub Pages 사이트](https://trillion-labs.github.io/pnid-understanding-bootcamp/)에서 읽을 수 있습니다.

## 워크북이 다루는 한 가지 흐름

```text
도면의 큰 구조를 파악합니다.
        ↓
질문과 관련된 부분을 확대해 작은 글자와 심벌을 확인합니다.
        ↓
AI 답을 원본 위치와 연결합니다.
        ↓
결과를 검색하고 비교할 수 있는 데이터로 정리합니다.
        ↓
같은 기준으로 평가하고 오류 하나를 개선합니다.
```

워크북의 중심 질문은 다음과 같습니다.

> 이 P&ID에서 `RECEPTION BIN 2`의 A측 하부 출구와 연결된 `VIBRO FEEDER #C`를 찾아 주세요. Reception Bin 2의 장비 태그, A측 밸브 번호, Feeder #C의 장비 태그, 연결된 전동기의 심벌 표기와 태그를 그대로 적어 주세요.

정답은 `11520-M-SI-04 → V186 → 11520-M-VB-03C → EM / 11520-E-MT-18`입니다. 워크북에서는 이 네 값을 이미지에서 얼마나 정확히 읽고 연결하는지 평가합니다.

## 권장 독서 순서

| 순서 | 문서 | 읽고 나면 할 수 있는 일 |
|---|---|---|
| 1 | [워크북 안내](docs/00-course-design-principles.md) | 전체 학습 흐름과 중심 질문을 이해합니다. |
| 2 | [P&ID 입문](docs/00-pid-primer.md) | 도면 구성요소와 전문가의 판단 순서를 따라갑니다. |
| 3 | [첫 번째 실제 실험](docs/01-program-design.md) | 전체 이미지·부분 확대 이미지·질문 방식에 따른 실제 결과를 비교합니다. |
| 4 | [이미지 입력 전략](docs/02-visual-prompting-strategy.md) | 전체 문맥과 세부 확대를 연결합니다. |
| 5 | [Tesseract OCR로 검색 가능한 P&ID 만들기](docs/02-ocr-for-agents.md) | 도구를 설치하고 검색 가능한 PDF를 만든 뒤 원본 이미지로 검증합니다. |
| 6 | [위치 상자와 텍스트 레이어](docs/03-screenshot-and-bbox.md) | AI 답을 원본 위치와 연결합니다. |
| 7 | [P&ID 데이터 정리](docs/04-pid-indexing.md) | 도면의 기본정보, 큰 구역과 주요 태그를 단계별 JSON으로 정리합니다. |
| 8 | [AI 답변 구조화](docs/04-data-schema.md) | AI 답을 검색하고 비교할 수 있는 표로 바꿉니다. |
| 9 | [Claude Code와 Codex 운영](docs/05-agent-workflow.md) | 목표·입력·규칙·출력·검사를 포함한 업무 계약을 만듭니다. |
| 10 | [터미널에서 직접 실행하기](docs/05-terminal-claude-codex.mdx) | Claude Code와 Codex 명령을 직접 타이핑하고 결과를 저장합니다. |
| 11 | [평가 기준](docs/06-evaluation.md) | 정답뿐 아니라 근거와 추측 여부를 함께 평가합니다. |
| 12 | [개선 과정](docs/14-benchmark-improvement-loop.md) | 오류 하나를 개선하고 같은 조건으로 다시 평가합니다. |

## 워크북 부록

| 문서 | 용도 |
|---|---|
| [첫 실험 상세 답변](docs/01-experiment-answer-details.md) | 본문에서 요약한 아홉 개 실제 모델 답변을 모두 확인합니다. |
| [프롬프트 카드](docs/08-prompt-cards.md) | 탐색·추출·검토 목적에 맞추어 요청문을 조정합니다. |
| [PDF에서 이미지 준비](docs/09-file-to-image-reference.md) | PDF 점검과 이미지 렌더링 과정을 재현합니다. |
| [스킬 추가 전후 실험](docs/12-skill-experiment.md) | 반복 지침을 스킬로 저장하고 전후를 비교합니다. |

## 기준 파일

- 교육용 파일명: `sample-pid.pdf`
- 도면 식별자: `J-11520-ZM-105-005`, Rev. F
- 전체 구조용 이미지: `assets/overview/sample-pid-overview-1600.png`
- Feeder #C 주변 확대 이미지: `assets/regions/feeder-c-area.png`
- 질문 근거 위치 예시: `assets/bbox/feeder-c-query-evidence.png`
- 검색 가능한 교육용 PDF: `assets/ocr/sample-pid-searchable-improved.pdf`

## 비식별 처리

사이트와 공개 저장소의 도면 이미지에는 회사명, 로고, 주소와 작성·검토자 영역을 가리는 불투명 마스크를 적용했습니다. 도면 제목, 도면번호, 시트와 Rev.F는 학습에 필요하여 유지했습니다.

내부 원본 PDF, 개인 메타데이터가 포함된 export 파일, OCR 원문과 모델의 검토 전 원시 응답은 공개 저장소에 포함하지 않습니다.

## 사이트를 로컬에서 확인하려면

```bash
npm install
npm run dev
```

정적 사이트 빌드와 문서 검색 색인은 다음 명령으로 확인합니다.

```bash
npm run build
```

## 가장 중요한 원칙

AI가 그럴듯하게 말한 값이 아니라, 원본 이미지에서 위치를 다시 확인할 수 있는 값만 데이터로 채택합니다.

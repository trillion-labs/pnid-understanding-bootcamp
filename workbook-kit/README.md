# P&ID × AI Agent 실습 키트

이 폴더는 공개 워크북의 학습 문서와 실습 파일을 모은 교육용 키트입니다.

> **먼저 확인하세요.** 이 워크북에서는 ZIP에 포함된 교육용 샘플만 사용합니다. 실제 사내 도면과 업무 문서는 회사가 승인한 AI 환경과 보안 정책을 확인하기 전에는 업로드하지 마세요.

## 처음 시작하는 순서

1. ZIP 압축을 풉니다.
2. 이 `README.md`를 읽습니다.
3. [워크북 안내](학습자료/00-워크북-안내.md)를 엽니다. 웹에서 읽으려면 [웹 워크북](https://trillion-labs.github.io/pnid-understanding-bootcamp/)을 사용합니다.
4. **워크북 안내 → P&ID 입문 → 이미지 확대·프롬프트 비교** 순서로 진행합니다.
5. 처음에는 아래 기본 경로만 따라갑니다. CLI와 파일 생성 실습은 나중에 선택할 수 있습니다.

## 어떤 경로로 참여하나요?

| 경로 | 대상 | 필요한 준비 |
|---|---|---|
| 기본 경로 | AI와 터미널이 처음인 참가자 | Codex 또는 Claude 앱 |
| CLI 비교 실습 | 명령어로 같은 조건을 반복 실행할 참가자 | Claude Code 또는 Codex CLI 설치와 로그인 |
| 고급 선택 실습 | OCR·좌표·결과 파일 생성까지 해볼 참가자 | 단원별로 안내하는 Node.js 또는 Tesseract |

처음에는 다음 세 폴더만 기억하면 됩니다.

- `실습자료/이미지/`: 전체 도면과 확대 이미지
- `실습자료/프롬프트/`: AI에게 입력할 질문
- `실습자료/ocr/`: 글자를 검색할 수 있는 P&ID PDF

`data/`, `templates/`, `experiments/`는 평가와 재사용을 위한 심화·검토 자료입니다. 해당 단원에서 안내하기 전에는 열지 않아도 됩니다.

## 기본 경로: 첫 AI 실습

1. Codex 또는 Claude에서 새 작업을 엽니다.
2. `실습자료/이미지/전체-도면.png`를 첨부합니다.
3. `실습자료/프롬프트/기본-질문.txt`를 텍스트 편집기로 열고 전체 내용을 복사합니다.
4. 이미지가 첨부된 같은 입력창에 질문을 붙여 넣고 실행합니다.
5. 답변에 표 형식의 네 항목이 나오면 [워크북 안내의 기준 답안](학습자료/00-워크북-안내.md#중심-질문과-기준-답안)과 비교합니다.
6. 다음 조건을 실행할 때에는 새 작업을 엽니다. 이전 답변에서 본 정보가 다음 결과에 영향을 주지 않게 하기 위해서입니다.

여기까지 되면 시작 준비가 끝난 것입니다. 이후에는 `학습자료/`의 번호를 따라가세요.

## 선택 경로: CLI로 네 조건 실행

이 절은 명령어 실습을 원하는 참가자만 진행합니다. 건너뛰어도 워크북의 핵심 내용을 학습할 수 있습니다.

터미널에서 압축을 푼 `pnid-ai-workbook-kit` 폴더로 이동한 뒤, Claude Code 또는 Codex CLI가 설치되고 로그인되어 있는지 확인합니다. 네 실행은 모델 사용량과 시간이 소요되며 결과는 `output/workbook-cli/`에 저장됩니다.

```bash
./scripts/run-workbook-cli.sh claude full
./scripts/run-workbook-cli.sh claude full-guided
./scripts/run-workbook-cli.sh claude zoom
./scripts/run-workbook-cli.sh claude zoom-guided
```

Codex를 사용한다면 `claude`를 `codex-luna` 또는 `codex-terra`로 바꾸세요. `full`과 `zoom`은 짧은 질문, `full-guided`와 `zoom-guided`는 단계별 질문을 사용합니다.

현재 워크북에 인용한 12개 실행의 프로토콜과 결과는 `experiments/image-reading/strict/README.md`와 `experiments/image-reading/strict/summary.csv`에서 확인할 수 있습니다.

## 고급 선택 실습 준비

- 5단원에서 위치 상자를 실제 파일로 만들 때만 Node.js와 `npm install`이 필요합니다.
- 4단원에서 OCR PDF를 직접 다시 만들 때만 Tesseract가 필요합니다.
- 설치가 어렵다면 준비된 이미지와 PDF를 사용하는 기본 경로만 진행해도 됩니다.

## 시작 확인

- **이번에 한 일:** ZIP을 풀고 기본·CLI·고급 경로를 구분했습니다.
- **확인할 결과:** 교육용 이미지와 질문 파일을 찾고 첫 AI 답변을 실행할 수 있습니다.
- **건너뛰어도 되는 일:** CLI, OCR 재생성, 위치 상자 파일 생성은 선택입니다.
- **다음 단계:** `학습자료/00-워크북-안내.md`를 엽니다.

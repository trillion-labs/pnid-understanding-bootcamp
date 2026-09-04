# P&ID × AI Agent 실습 키트

이 폴더는 공개 워크북의 실습 파일과 검토된 참고 자료를 모은 사본입니다.

전체 설명은 [웹 워크북](https://trillion-labs.github.io/pnid-understanding-bootcamp/)에서 읽습니다. AI나 터미널이 처음이라면 웹 워크북의 **워크북 안내 → P&ID 입문 → 이미지 확대·프롬프트 비교** 순서로 시작하세요.

처음에는 다음 세 폴더만 기억하면 됩니다.

- `실습자료/이미지/`: 전체 도면과 확대 이미지
- `실습자료/프롬프트/`: AI에게 입력할 기본 질문, 단계별 질문과 확대 허용 일반형 질문
- `실습자료/ocr/`: 글자를 검색할 수 있는 P&ID PDF

`data/`, `templates/`, `experiments/`, `skills/`에는 웹 워크북과 실습에서 사용하는 평가표, 데이터 예시, 현재 기준 실험과 재사용 지침이 있습니다.

## 시작하기

1. 이 압축 파일을 풉니다.
2. 가장 쉬운 방법은 `실습자료/이미지/전체-도면.png`를 Claude 또는 Codex의 새 대화에 첨부하고 `실습자료/프롬프트/기본-질문.txt`를 붙여 넣는 것입니다.
3. CLI 실습을 선택했다면 터미널에서 압축을 푼 `pnid-ai-workbook-kit` 폴더로 이동합니다.
4. Claude Code 또는 Codex가 설치되어 있고 로그인되어 있는지 확인합니다.
5. 같은 모델에서 아래 네 조건을 각각 새 세션으로 실행합니다.

```bash
./scripts/run-workbook-cli.sh claude full
./scripts/run-workbook-cli.sh claude full-guided
./scripts/run-workbook-cli.sh claude zoom
./scripts/run-workbook-cli.sh claude zoom-guided
```

Codex를 사용한다면 네 명령의 `claude`를 모두 `codex-luna` 또는 `codex-terra`로 바꾸세요. `full`과 `zoom`은 짧은 질문, `full-guided`와 `zoom-guided`는 단계별 질문을 사용합니다. Windows PowerShell에서는 `.sh` 파일을 직접 실행할 수 없으므로 WSL의 Ubuntu 또는 Git Bash를 사용합니다. 회사 PC에서 설치가 제한되면 CLI 단계를 건너뛰고 앱에 이미지를 첨부하는 경로를 사용하세요.

현재 워크북에 인용한 12개 실행의 프로토콜과 결과는 `experiments/image-reading/strict/README.md`와 `experiments/image-reading/strict/summary.csv`에서 확인할 수 있습니다.

위치 상자 실습에서 Node.js의 `sharp`를 사용하려면 이 폴더에서 `npm install`을 한 번 실행합니다. 이 단계는 5단원의 선택 실습에서만 필요합니다.

OCR 단원의 파일을 직접 다시 만들려면 Tesseract와 Poppler가 필요합니다. 설치 방법은 워크북의 4단원을 참고하세요.

이 키트에는 교육용으로 비식별 처리된 이미지와 실습 파일만 포함되어 있습니다.

실제 사내 도면이나 업무 문서는 회사가 승인한 AI 환경과 보안 정책을 확인하기 전에는 외부 AI 서비스에 업로드하지 마세요.

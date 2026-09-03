# P&ID × AI Agent 실습 키트

이 폴더는 공개 워크북의 명령 실습에 필요한 파일만 모은 사본입니다.

처음에는 다음 세 폴더만 기억하면 됩니다.

- `실습자료/이미지/`: 전체 도면과 확대 이미지
- `실습자료/프롬프트/`: AI에게 입력할 기본 질문과 단계별 질문
- `실습자료/ocr/`: 글자를 검색할 수 있는 P&ID PDF

## 시작하기

1. 이 압축 파일을 풉니다.
2. 터미널에서 압축을 푼 `pnid-ai-workbook-kit` 폴더로 이동합니다.
3. Claude Code 또는 Codex가 설치되어 있고 로그인되어 있는지 확인합니다.
4. 다음과 같이 첫 실험을 실행합니다.

```bash
./scripts/run-workbook-cli.sh claude full
./scripts/run-workbook-cli.sh codex-luna zoom
```

OCR 단원의 파일을 직접 다시 만들려면 Tesseract와 Poppler가 필요합니다. 설치 방법은 워크북의 4단원을 참고하세요.

이 키트에는 교육용으로 비식별 처리된 이미지와 실습 파일만 포함되어 있습니다.

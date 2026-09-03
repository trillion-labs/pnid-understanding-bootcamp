# Tesseract OCR로 검색 가능한 P&ID 만들기

앞 단원에서는 같은 도면도 전체 이미지로 볼 때와 필요한 부분을 확대해서 볼 때 답변이 달라질 수 있다는 점을 확인했습니다. 이번에는 이미지 안의 글자를 검색할 수 있게 만들어 봅니다.

실습을 마치면 `sample-pid.pdf`와 모양은 같지만 `Ctrl+F`로 `VIBRO FEEDER`를 찾을 수 있는 새 PDF가 생깁니다. 사람이 문자열을 검색할 수 있게 되면 AI 에이전트도 긴 도면에서 관련 단어를 먼저 찾고, 확인해야 할 구역을 더 빠르게 좁힐 수 있습니다.

<div class="lesson-summary">
  <p class="lesson-summary__label">이 단원에서 할 일</p>
  <ul>
    <li>Tesseract OCR로 도면에 검색 가능한 텍스트 레이어를 만듭니다.</li>
    <li>검색 결과를 원본 이미지의 위치와 다시 대조합니다.</li>
  </ul>
  <p class="lesson-summary__outcome"><strong>완료 기준</strong> PDF에서 태그를 검색하고 판독 결과를 원본에서 검증할 수 있습니다.</p>
</div>

## OCR을 적용하면 무엇이 달라지나요?

원본 PDF에는 글자가 선명하게 보입니다. 그러나 이 글자는 PDF의 문자라기보다 한 장의 그림에 포함된 픽셀입니다. 따라서 마우스로 선택하거나 `Ctrl+F`로 검색할 수 없습니다.

OCR은 그림 속 글자를 읽어 같은 위치에 보이지 않는 문자를 겹쳐 놓습니다. 이 숨은 문자 정보를 `텍스트 레이어`라고 합니다. 텍스트 레이어를 추가해도 화면에 보이는 도면은 그대로지만, PDF 뷰어와 AI 에이전트가 문자에 접근할 수 있게 됩니다.

```text
원본 PDF                OCR을 적용한 PDF
글자가 눈에만 보임  →   글자가 보이고 검색도 됨
Ctrl+F 검색 불가        Ctrl+F 검색 가능
이미지부터 탐색         문자열로 후보를 먼저 탐색
```

OCR은 도면을 이해하는 정답지가 아닙니다. 장비 사이의 배관 연결이나 심벌의 의미는 여전히 이미지를 보고 확인해야 합니다. 이 단원에서는 OCR을 **정답을 대신 만드는 도구가 아니라, 확인할 위치를 찾는 도구**로 사용합니다.

## 1. 내 컴퓨터에서 실행할 준비를 합니다

이 실습에는 두 프로그램이 필요합니다.

- `Tesseract`: 이미지에서 글자를 읽고 검색 가능한 PDF를 만듭니다.
- `Poppler`: 만들어진 PDF에서 검색용 문자를 꺼내 확인합니다. 설치 후에는 `pdftotext`라는 명령으로 사용합니다.

터미널을 열고 다음 두 명령을 한 줄씩 입력합니다.

```bash
tesseract --version
```

```bash
pdftotext -v
```

두 명령 모두 버전 번호를 보여 주면 바로 다음 절로 이동합니다. `command not found` 또는 "명령을 찾을 수 없습니다"라는 메시지가 나오면 사용하는 운영체제에 맞게 설치합니다.

### macOS에서 설치합니다

[Homebrew](https://brew.sh/)가 설치된 터미널에서 다음 명령을 입력합니다.

```bash
brew install tesseract poppler
```

설치가 끝나면 터미널을 닫았다가 다시 열고, 위의 버전 확인 명령을 다시 입력합니다.

### Ubuntu 또는 Windows WSL에서 설치합니다

다음 명령을 한 줄씩 입력합니다.

```bash
sudo apt update
```

```bash
sudo apt install -y tesseract-ocr poppler-utils
```

Windows 참가자는 이 워크북의 셸 스크립트를 그대로 실행할 수 있도록 WSL의 Ubuntu 터미널을 사용하는 것을 권장합니다. WSL이 없다면 관리자 권한 PowerShell에서 다음 명령으로 먼저 설치한 뒤 컴퓨터를 다시 시작합니다.

```powershell
wsl --install -d Ubuntu
```

Ubuntu 터미널이 열리면 앞의 `sudo apt` 명령 두 개를 입력합니다.

## 2. 검색 가능한 PDF를 직접 만듭니다

터미널에서 이 저장소의 폴더로 이동합니다. 저장소가 `~/Projects/pnid-understanding-bootcamp`에 있다면 다음과 같이 입력합니다.

```bash
cd ~/Projects/pnid-understanding-bootcamp
```

현재 위치가 맞는지 확인합니다.

```bash
pwd
```

이제 준비된 스크립트를 실행합니다.

```bash
./scripts/build-ocr-assets.sh
```

권한 오류가 나오면 다음 명령으로 실행해도 됩니다.

```bash
bash scripts/build-ocr-assets.sh
```

정상적으로 끝나면 터미널 마지막에 다음과 비슷한 결과가 표시됩니다.

```text
완료했습니다.
PDF: assets/ocr/sample-pid-ocr.pdf
전체 OCR: data/ocr/sample-pid-full-improved.tsv
부분 확대 OCR: data/ocr/feeder-c-area-improved.tsv
```

이 실습에서 가장 중요한 결과물은 다음 PDF입니다.

[검색 가능한 P&ID 열기](/pnid-understanding-bootcamp/downloads/sample-pid-ocr.pdf)

로컬 컴퓨터에서 직접 생성된 파일은 저장소의 `assets/ocr/sample-pid-ocr.pdf`에 있습니다.

## 3. 정말 검색되는지 확인합니다

생성된 PDF를 Chrome, Edge 또는 Adobe Acrobat으로 엽니다. `Ctrl+F`를 누르고 다음 문구를 검색합니다. macOS에서는 `Command+F`를 사용합니다.

```text
VIBRO FEEDER
```

다음 장비 태그도 검색해 봅니다.

```text
11520-M-SI-04
```

검색 결과가 표시되면 이미지였던 도면 위에 텍스트 레이어가 만들어진 것입니다. 같은 PDF에서 모든 글자가 완벽하게 검색되는 것은 아닙니다. 작은 글자, 선과 겹친 태그, 심벌 가까이에 있는 글자는 다르게 읽히거나 빠질 수 있습니다.

## 4. OCR 파일을 AI 에이전트와 함께 사용합니다

OCR을 적용하기 전에는 에이전트가 큰 이미지 안에서 장비 이름부터 눈으로 찾아야 합니다. OCR PDF를 함께 주면 먼저 `VIBRO FEEDER` 같은 문자열을 찾고, 그 주변만 확대하여 이미지에서 확인할 수 있습니다.

에이전트에게는 다음과 같이 역할을 분명히 알려 줍니다.

```text
OCR 텍스트는 검색 후보를 찾는 데만 사용해 주세요.
장비 태그와 배관 연결은 원본 이미지의 확대 구역에서 다시 확인해 주세요.
OCR과 이미지가 다르면 차이를 적고, 확인되지 않은 값은 추측하지 마세요.
```

이 지시가 필요한 이유는 글자를 잘 찾는 능력과 도면의 연결 관계를 정확히 읽는 능력이 서로 다르기 때문입니다. OCR에서 `VIBRO FEEDER`를 찾았더라도, 바로 위 장비나 옆의 밸브를 어느 피더에 연결해야 하는지는 이미지의 선을 따라가며 확인해야 합니다.

## 5. 실제 모델 답변에서는 어떤 변화가 있었나요?

이 워크북에서는 전체 이미지만 제공한 경우와 전체 이미지에 OCR 파일을 추가한 경우를 각각 한 번 비교했습니다.

| 모델 | 전체 이미지만 제공 | 전체 이미지와 OCR 제공 | 관찰한 변화 |
|---|---:|---:|---|
| Claude Sonnet | 3/4 | 3/4 | 전동기 태그는 맞아졌지만 가까운 밸브의 연결을 잘못 판단했습니다. |
| Codex Luna | 2/4 | 4/4 | OCR로 문자열 후보를 찾은 뒤 이미지에서 네 항목을 확인했습니다. |

이 결과만으로 한 모델이 항상 더 좋다고 말할 수는 없습니다. 다만 OCR을 추가하면 에이전트가 찾을 수 있는 문자열이 늘어나고, 그 문자열을 이미지에서 다시 검증하도록 지시해야 한다는 점은 확인할 수 있습니다.

표의 항목별 채점과 관찰 메모는 `data/ocr/ocr-agent-comparison.csv`에서 확인할 수 있습니다.

## 이 단원에서 만든 작업 흐름

```text
Tesseract 설치 확인
        ↓
스크립트로 검색 가능한 PDF 생성
        ↓
Ctrl+F로 문자열 검색 확인
        ↓
에이전트가 OCR로 후보 위치 탐색
        ↓
원본 이미지에서 글자와 연결 관계 검증
```

이제 에이전트가 찾은 근거를 다른 사람도 같은 위치에서 다시 확인할 수 있어야 합니다. 다음 단원에서는 도면의 특정 구역을 위치 상자로 표시하고 기록하는 방법을 살펴봅니다.

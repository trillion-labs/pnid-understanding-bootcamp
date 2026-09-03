# OCR로 도면 검색하기

앞 단원에서는 같은 도면도 전체 이미지로 볼 때와 필요한 부분을 확대해서 볼 때 답변이 달라질 수 있다는 점을 확인했습니다. 이번에는 이미지 안의 글자를 검색할 수 있게 만들어 봅니다.

실습을 마치면 `실습자료/ocr/검색가능한-pnid.pdf`가 만들어집니다. 이 파일에서는 `Ctrl+F`로 `VIBRO FEEDER`를 찾을 수 있습니다. 사람이 문자열을 검색할 수 있게 되면 AI 에이전트도 긴 도면에서 관련 단어를 먼저 찾고, 확인해야 할 구역을 더 빠르게 좁힐 수 있습니다.

<div class="lesson-summary">
  <p class="lesson-summary__label">이 단원에서 할 일</p>
  <ul>
    <li>Tesseract OCR로 도면에 검색 가능한 텍스트 레이어를 만듭니다.</li>
    <li>검색 결과를 원본 이미지의 위치와 다시 대조합니다.</li>
  </ul>
  <p class="lesson-summary__outcome"><strong>완료 기준:</strong> PDF에서 태그를 검색하고 판독 결과를 원본에서 검증할 수 있습니다.</p>
</div>

<div class="scope-note">
  <p class="scope-note__label">P&amp;ID 밖에서도 사용할 수 있습니다</p>
  <p>P&amp;ID를 예제로 사용하지만 이 원리는 특정 도면 형식에만 해당하지 않습니다. 스캔한 매뉴얼, 설비 도면, 검사 성적서, 오래된 양식, 이미지 기반 PDF처럼 <strong>눈에는 보이지만 검색되지 않는 문서</strong>에도 같은 방식으로 텍스트 레이어를 추가할 수 있습니다. 문서의 언어·배치·글자 크기에 맞춰 OCR 설정과 검증 기준만 조정하면 됩니다.</p>
</div>

## OCR을 적용하면 무엇이 달라지나요?

원본 PDF에서 글자는 선명하게 보입니다. 하지만 PDF 문자 데이터가 아니라 그림에 포함된 픽셀이어서 마우스로 선택하거나 `Ctrl+F`로 검색할 수 없습니다.

OCR은 그림 속 글자를 읽어 같은 위치에 보이지 않는 문자를 겹쳐 놓습니다. 이 숨은 문자 정보를 텍스트 레이어라고 합니다. <mark class="text-highlight">텍스트 레이어를 추가하면 화면의 도면은 그대로 유지하면서 문자를 검색할 수 있습니다.</mark>

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
PDF: 실습자료/ocr/검색가능한-pnid.pdf
전체 OCR: data/ocr/전체-도면-ocr.tsv
부분 확대 OCR: data/ocr/feeder-c-area-improved.tsv
```

이 실습에서 가장 중요한 결과물은 다음 PDF입니다.

[검색 가능한 P&ID 열기](/pnid-understanding-bootcamp/downloads/검색가능한-pnid.pdf)

로컬 컴퓨터에서 직접 생성된 파일은 저장소의 `실습자료/ocr/검색가능한-pnid.pdf`에 있습니다.

## 3. 정말 검색되는지 확인합니다

생성된 PDF를 Chrome, Edge 또는 Adobe Acrobat으로 엽니다. `Ctrl+F`를 누르고 다음 문구를 검색합니다. macOS에서는 `Command+F`를 사용합니다.

```text
VIBRO FEEDER
```

다음 장비 태그도 검색해 봅니다.

```text
11520-M-SI-04
```

검색 결과가 표시되면 이미지 도면 위에 텍스트 레이어가 만들어진 것입니다. 그렇다고 모든 글자가 완벽하게 검색되지는 않습니다. 작은 글자나 선과 겹친 태그, 심벌 가까이에 있는 글자는 잘못 읽히거나 빠질 수 있습니다.

## OCR 품질이 아쉬울 때 무엇을 바꿀 수 있나요?

기본 실습을 마친 뒤 특정 태그가 계속 빠지거나 틀리게 읽힌다면 아래 항목을 하나씩 펼쳐 확인해 보세요. 여러 설정을 한꺼번에 바꾸면 무엇이 효과가 있었는지 알기 어려우므로, **한 번에 하나만 바꾸고 같은 검색어로 전후 결과를 비교**하는 것이 좋습니다.

<details class="practice-result">
  <summary>도면에 자주 나오는 장비명과 태그를 사용자 사전에 추가하기</summary>
  <div class="practice-result__body">

Tesseract의 사용자 단어 사전은 일반 영어 사전에 없는 `VIBRO`, `FEEDER`, 장비 태그 같은 문자열을 후보로 알려 줍니다. 먼저 한 줄에 한 단어씩 파일을 만듭니다.

```text title="data/ocr/pnid-user-words.txt"
BOILER
OFA
CONVEYOR
FLEXIBLE
RECEPTION
VIBRO
```

실제 예제 사전에는 도면에서 확인한 P&ID 용어 46개가 들어 있습니다. `ae`, `KA]`, `VN`처럼 선이나 심벌을 글자로 잘못 읽은 결과는 사전 단어로 추가하지 않습니다.

그다음 기존 Tesseract 명령에 다음 옵션을 추가합니다.

```bash
--user-words data/ocr/pnid-user-words.txt
```

이 워크북의 `scripts/build-ocr-assets.sh`에는 위 사전이 이미 연결되어 있습니다. 직접 실행할 때의 전체 명령은 다음과 같습니다.

```bash
tesseract input.png output -l eng --psm 6 --user-words data/ocr/pnid-user-words.txt pdf
```

사전은 흐릿한 글자를 선명하게 만들거나 없는 글자를 찾아내는 기능은 아닙니다. OCR이 비슷한 후보 사이에서 고민할 때 도메인 단어를 우선하도록 돕습니다. 실제 도면에서 확인한 단어만 넣고, 예상한 정답을 무작정 많이 넣지는 마세요.

  </div>
</details>

<details class="practice-result">
  <summary>글자가 흩어진 도면에 맞게 페이지 분할 모드 바꾸기</summary>
  <div class="practice-result__body">

`--psm`은 Tesseract가 글자의 배치를 어떻게 가정할지 정하는 옵션입니다. 일반 문서와 달리 글자가 여러 위치에 흩어진 P&ID에서는 `--psm 11`이 유용할 수 있습니다. 이 워크북의 스크립트는 전체 도면에 `--psm 11`, 잘라낸 확대 이미지에 `--psm 6`을 사용합니다.

```bash
tesseract input.png output-psm11 -l eng --psm 11 tsv
```

| 모드 | 가정 | 비교해 볼 상황 |
|---|---|---|
| `6` | 하나의 텍스트 블록 | 일정한 구역을 잘라낸 이미지 |
| `11` | 흩어진 글자를 가능한 만큼 탐색 | 전체 도면처럼 라벨 위치가 분산된 이미지 |
| `13` | 한 줄의 글자 | 장비 태그 한 줄만 아주 작게 잘라낸 이미지 |

한 모드가 모든 도면에서 가장 좋지는 않습니다. 동일한 이미지로 TSV를 각각 만든 뒤, 필요한 태그가 더 잘 남는 쪽을 선택합니다.

  </div>
</details>

<details class="practice-result">
  <summary>작은 글자는 먼저 확대하고 필요한 구역만 OCR하기</summary>
  <div class="practice-result__body">

<mark class="text-highlight">OCR 설정 자체보다 입력 이미지의 크기와 선명도가 더 큰 차이를 만드는 경우가 많습니다.</mark> 전체 도면의 작은 태그가 빠진다면 원본 PDF를 더 높은 해상도로 변환하거나, 필요한 구역을 잘라 2~4배 확대해 다시 OCR합니다. 이 워크북도 전체 도면과 `Feeder #C` 확대 이미지를 따로 처리합니다.

확대할 때는 화면 캡처보다 원본 PDF 또는 원본 고해상도 이미지에서 다시 추출하세요. 글자가 선과 겹쳐 있다면 회색조·이진화가 도움이 될 수 있지만, 너무 강한 이진화는 가는 글자 획을 없앨 수 있습니다. 원본, 확대본, 전처리본을 각각 남겨 비교하는 편이 안전합니다.

  </div>
</details>

<details class="practice-result">
  <summary>한국어가 섞인 도면에 언어 데이터 추가하기</summary>
  <div class="practice-result__body">

`-l eng`은 영어만 읽습니다. 한국어 설명이 함께 있는 도면이라면 한국어 언어 데이터를 설치하고 `eng+kor`로 실행할 수 있습니다.

```bash
# macOS
brew install tesseract-lang
```

```bash
# Ubuntu 또는 WSL
sudo apt install -y tesseract-ocr-kor
```

```bash
tesseract input.png output -l eng+kor --psm 6 pdf
```

설치된 언어는 `tesseract --list-langs`로 확인합니다. 사용하지 않는 언어를 많이 지정하면 처리 시간이 늘고 비슷한 글자를 혼동할 수 있으므로, 실제 도면에 있는 언어만 선택하세요.

  </div>
</details>

<details class="practice-result">
  <summary>개선됐는지 같은 기준으로 비교하기</summary>
  <div class="practice-result__body">

몇 개가 눈에 잘 보인다는 느낌만으로 설정을 고르지 않습니다. 먼저 반드시 찾아야 할 장비명과 태그 10~20개를 정하고, 각 설정에서 정확히 검색되는 개수를 기록합니다. 잘못 읽은 문자열과 놓친 문자열도 함께 남기면 다음에 사전, 확대, `--psm` 중 무엇을 바꿀지 판단하기 쉽습니다.

```text
설정: 기본(--psm 6) / 사전 추가 / --psm 11 / 구역 확대
확인: 정답 수 / 오인식 수 / 누락 수
```

최종 설정을 고른 뒤에도 OCR 문자열은 후보로만 사용하고 원본 이미지에서 다시 확인합니다.

  </div>
</details>

## 4. OCR 파일을 AI 에이전트와 함께 사용합니다

OCR을 적용하기 전에는 에이전트가 큰 이미지에서 장비 이름부터 눈으로 찾아야 합니다. OCR PDF를 함께 주면 `VIBRO FEEDER` 같은 문자열을 먼저 검색한 뒤 그 주변만 확대해 원본 이미지와 대조할 수 있습니다.

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

이 결과만으로 어느 모델이 항상 더 낫다고 단정할 수는 없습니다. 실험에서 확인한 것은 두 가지입니다. OCR을 추가하면 에이전트가 검색할 문자열이 늘어나고, 검색한 문자열은 반드시 이미지에서 다시 검증해야 합니다.

표의 항목별 채점과 관찰 메모는 `data/ocr/ocr-agent-comparison.csv`에서 확인할 수 있습니다.

## 이 단원에서 만든 작업 흐름

<div class="process-flow" style="--flow-columns: 5">
  <div class="process-step"><span class="process-step__number">1</span><strong>도구 설치 확인</strong></div>
  <div class="process-step"><span class="process-step__number">2</span><strong>검색 가능한 PDF 생성</strong></div>
  <div class="process-step"><span class="process-step__number">3</span><strong>문자열 검색 확인</strong></div>
  <div class="process-step"><span class="process-step__number">4</span><strong>후보 위치 탐색</strong></div>
  <div class="process-step"><span class="process-step__number">5</span><strong>원본에서 검증</strong></div>
</div>

다음 단계는 에이전트가 찾은 근거를 다른 사람도 같은 위치에서 확인하게 만드는 일입니다. 다음 단원에서는 도면의 특정 구역을 위치 상자로 표시하고 기록합니다.

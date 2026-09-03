# 첫 번째 실험: 작은 태그는 확대하면 더 잘 읽을까요?

앞 단원에서는 Reception Bin 2의 A측 출구에서 선을 따라 Feeder #C와 전동기까지 확인했습니다. 이번에는 같은 작업을 Claude Sonnet, Codex Luna, Codex Terra에 맡겨봅니다.

처음에는 도면 전체를 한눈에 볼 수 있도록 축소한 이미지를 보여 줍니다. 모델이 작은 태그를 제대로 읽지 못하면 질문과 관련된 부분만 확대하여 같은 질문을 다시 전달합니다.

이 실험의 목적은 모델 순위를 정하는 것이 아닙니다. 전체 이미지로 위치를 찾고, 작은 글자가 필요할 때 원본의 관련 구역을 확대하는 과정을 직접 확인하는 데 있습니다.

<div class="lesson-summary">
  <p class="lesson-summary__label">이 단원에서 할 일</p>
  <ul>
    <li>전체 이미지와 부분 확대 이미지를 같은 질문으로 비교합니다.</li>
    <li>모델 답변의 네 항목을 기준 답안으로 직접 채점합니다.</li>
  </ul>
  <p class="lesson-summary__outcome"><strong>완료 기준</strong> 이미지 범위가 작은 태그 판독에 미치는 영향을 설명할 수 있습니다.</p>
</div>

## 답이 명확한 질문을 사용합니다

세 모델에 다음 질문을 동일하게 전달했습니다.

> 이 P&ID에서 `RECEPTION BIN 2`의 A측 하부 출구와 연결된 `VIBRO FEEDER #C`를 찾아 주세요. 도면에 직접 표시된 ① Reception Bin 2의 장비 태그, ② A측 하부 출구의 밸브 번호, ③ Vibro Feeder #C의 장비 태그, ④ Feeder #C에 연결된 전동기의 심벌 표기와 태그를 그대로 적고 연결 관계를 설명해 주세요. 이미지에서 확인되지 않는 값은 추측하지 마세요.

이 질문은 네 항목의 문자열이 맞는지 각각 확인할 수 있습니다. 고장 원인이나 심벌 의미처럼 해석에 따라 달라질 수 있는 항목은 평가 대상에서 제외했습니다.

## 먼저 기준 답안을 확인합니다

실행 결과를 비교하기 전에 원본 도면에서 확인한 정답을 준비합니다. 각 항목의 문자열을 모두 정확히 읽으면 1점입니다.

| 평가 항목 | 기준 답안 |
|---|---|
| Reception Bin 2 장비 태그 | `11520-M-SI-04` |
| A측 하부 출구 밸브 | `V186` |
| Vibro Feeder #C 장비 태그 | Unit 1과 Unit 2 모두 `11520-M-VB-03C` |
| Feeder #C 전동기 | 원 안의 `EM`, 태그 `11520-E-MT-18` |

오른쪽의 `11520-E-MT-19`는 다른 Feeder에 연결된 전동기이므로 Feeder #C의 답으로 인정하지 않습니다. 일부 문자만 맞거나 잘못된 값을 함께 적으면 해당 항목은 0점으로 처리합니다.

이 표를 옆에 두고 각 실행 결과가 4점 만점에 몇 점인지 먼저 직접 채점해 보세요.

## 이제 직접 실행해 봅니다

아래 실습은 실제 Codex 또는 Claude 모델을 호출하고 결과를 `output/workbook-cli/`에 저장합니다. 시작하기 전에 터미널에서 `codex --version` 또는 `claude --version`을 실행해 설치 여부를 확인하고, 처음 사용하는 경우 해당 CLI를 열어 로그인해 주세요.

각 단계에서는 **명령을 먼저 실행하고 답변을 읽어 본 뒤** 결과 토글을 열어 비교합니다. 예시는 Codex Luna를 사용하지만, Claude를 사용하려면 명령의 `codex-luna`를 `claude`로 바꿀 수 있습니다.

> **스크립트 말고 직접 대화해 보고 싶나요?**
>
> - **Codex:** 프로젝트 폴더에서 `codex --image assets/overview/sample-pid-overview-1600.png`를 실행한 뒤 `experiments/single-image-prompt/prompts/short.txt`의 질문을 붙여 넣습니다. 입력창에 이미지를 직접 붙여 넣어도 됩니다.
> - **Claude Code:** 프로젝트 폴더에서 `claude`를 실행합니다. 입력창에 `@assets/overview/sample-pid-overview-1600.png`를 입력해 파일을 선택한 뒤 같은 질문을 붙여 넣습니다.
>
> 두 번째 실험에서는 이미지 경로만 `assets/regions/feeder-c-area-long-edge-1600.png`로 바꾸면 됩니다. 자세한 사용법은 [OpenAI 이미지 입력 안내](https://learn.chatgpt.com/docs/image-inputs)와 [Claude Code CLI 안내](https://docs.anthropic.com/en/docs/claude-code/cli-usage)를 참고하세요.

## 실험 1: 전체를 한눈에 보는 이미지로 시작합니다

도면 제목, 범례와 전체 연결이 한 화면에 보이는 이미지를 제공합니다. Reception Bin 2가 어느 부분에 있는지는 알 수 있지만 작은 태그는 매우 작게 보입니다.

터미널에서 다음 명령을 실행하고, 네 항목 가운데 몇 개를 정확히 읽었는지 먼저 세어 보세요.

```bash
./scripts/run-workbook-cli.sh codex-luna full
```

- `codex-luna`: GPT-5.6 Luna로 실행합니다.
- `full`: 전체 도면 이미지 `assets/overview/sample-pid-overview-1600.png`를 입력합니다.
- 질문: `experiments/single-image-prompt/prompts/short.txt`를 사용합니다.
- 저장: 실행 결과는 `output/workbook-cli/` 아래에 시간과 조건이 포함된 파일명으로 저장됩니다.

<details class="practice-result">
  <summary>실행을 마쳤다면 결과 확인하기</summary>
  <div class="practice-result__body">
    <p><strong>기록된 Luna 결과는 2/4였습니다.</strong></p>
    <p class="practice-result__label">실제 답변</p>
    <blockquote>
      <p>Reception Bin 2 장비 태그: <code>11520-M-SI-04</code><br />
      A측 하부 출구 밸브 번호: <code>V186</code><br />
      Vibro Feeder #C 장비 태그: <code>11520-M-V-03C</code><br />
      전동기 심벌 및 태그: <code>EX</code>, <code>11520-M-E-17</code></p>
    </blockquote>
    <p>Reception Bin 2 태그와 V186은 맞았지만 Feeder 태그를 <code>11520-M-V-03C</code>, 전동기를 <code>EX / 11520-M-E-17</code>로 잘못 읽었습니다. 다른 모델도 전체 이미지에서는 2~3점에 머물렀습니다.</p>
  </div>
</details>

> 질문은 맞는 것 같은데 왜 못 읽었을까요? 전체 도면 안에서 정답 글자가 너무 작게 보였을 가능성이 있습니다.

## 실험 2: 필요한 구역을 확대해서 다시 확인합니다

Reception Bin 2, V186, Feeder #C와 전동기가 한 화면에 보이는 부분 확대 이미지를 제공합니다.

![Feeder #C 주변 확대 이미지](../assets/regions/feeder-c-area-long-edge-1600.png)

네 항목은 크게 보이지만 제목란과 다른 계통은 이미지 밖으로 사라집니다. 질문은 바꾸지 않고 이미지만 교체했습니다.

이번에는 질문과 모델을 그대로 두고 이미지 조건만 `zoom`으로 바꿔 실행해 보세요.

```bash
./scripts/run-workbook-cli.sh codex-luna zoom
```

- `codex-luna`: 첫 번째 실행과 같은 GPT-5.6 Luna를 사용합니다.
- `zoom`: 부분 확대 이미지 `assets/regions/feeder-c-area-long-edge-1600.png`를 입력합니다.
- 질문: 첫 번째 실행과 같은 `experiments/single-image-prompt/prompts/short.txt`를 사용합니다.
- 저장: 별도의 결과 파일이 `output/workbook-cli/`에 생성되므로 `full` 결과와 나란히 비교할 수 있습니다.

전체 이미지 결과와 비교해 Feeder 태그와 전동기 태그가 달라졌는지 확인합니다.

<details class="practice-result">
  <summary>두 답변을 비교했다면 결과 확인하기</summary>
  <div class="practice-result__body">
    <p><strong>기록된 Luna 결과는 2/4에서 4/4로 올랐습니다.</strong></p>
    <p class="practice-result__label">실제 답변</p>
    <blockquote>
      <p>1. RECEPTION BIN 2 장비 태그: <code>11520-M-SI-04</code><br />
      2. A측 하부 출구 밸브 번호: <code>V186</code><br />
      3. VIBRO FEEDER #C 장비 태그: <code>11520 M-VB-03C</code><br />
      4. 연결 전동기 심벌 및 태그: <code>EM</code>, <code>11520-E-MT-18</code></p>
    </blockquote>
    <p><code>11520-M-SI-04</code>, <code>V186</code>, <code>11520-M-VB-03C</code>, <code>EM / 11520-E-MT-18</code>을 모두 정확히 읽었습니다. 같은 확대 조건에서 Sonnet과 Terra도 4/4를 받았습니다.</p>
  </div>
</details>

같은 질문과 같은 모델이어도 필요한 글자와 연결을 읽을 수 있는 크기로 보여 주자 결과가 달라졌습니다.

## 실행한 모델

- Claude Sonnet
- GPT-5.6 Luna
- GPT-5.6 Terra

Claude는 `claude -p`, Codex는 `codex exec --image`로 실행했습니다. 모든 실행은 이전 대화가 없는 새 세션에서 진행했습니다.

## 실제 실행 결과

| 모델 | 전체를 한눈에 보는 이미지 | 부분 확대 이미지 |
|---|---:|---:|
| Claude Sonnet | 3/4 | 4/4 |
| Codex Luna | 2/4 | 4/4 |
| Codex Terra | 2/4 | 4/4 |

이번 질문에서는 부분 확대 이미지와 같은 짧은 질문을 사용했을 때 세 모델이 모두 4점을 받았습니다. 전체를 한눈에 보는 이미지에서는 작은 Feeder 태그와 전동기 태그를 잘못 읽거나 확인하지 못했습니다.

<details class="practice-result">
  <summary>원본 고해상도 전체 도면은 어땠을까요?</summary>
  <div class="practice-result__body">
    <p>4963×3509px 원본 전체 도면을 그대로 입력한 추가 실험에서는 세 모델 모두 4/4를 받았습니다.</p>
    <p>따라서 문제는 전체 도면 자체가 아니라 작은 글자를 읽을 수 있는 정보가 남아 있는지, 그리고 필요한 곳을 확대할 수 있는지에 있습니다. 이 단원에서는 현업의 검토 순서를 연습하기 위해 전체에서 위치를 찾고 관련 구역을 확대하는 흐름을 사용합니다.</p>
  </div>
</details>

## 두 답변으로 차이를 확인합니다

### 전체를 한눈에 보는 이미지에서 작은 태그를 잘못 읽은 사례

Codex Luna는 전체 이미지에서 다음과 같이 답했습니다.

> Feeder #C 장비 태그: `11520-M-V-03C`<br>
> 전동기 심벌 및 태그: `EX`, `11520-M-E-17`

Reception Bin 태그와 V186은 맞았지만 Feeder 태그와 전동기 태그는 모두 틀렸습니다. 전체 구조는 파악했어도 작은 글자를 정확히 읽지 못한 사례입니다.

### 부분 확대 이미지에서 네 항목을 모두 확인한 사례

Codex Luna의 부분 확대+짧은 질문 답변은 다음과 같습니다.

> 1. RECEPTION BIN 2 장비 태그: `11520-M-SI-04`<br>
> 2. A측 하부 출구 밸브 번호: `V186`<br>
> 3. VIBRO FEEDER #C 장비 태그: `11520 M-VB-03C`<br>
> 4. 연결 전동기 심벌 및 태그: `EM`, `11520-E-MT-18`

네 문자열과 연결 관계를 모두 정확히 확인했습니다. 같은 모델이라도 이미지 범위가 달라지자 2점에서 4점으로 바뀌었습니다.

기존 단계별 질문까지 포함한 모델별 답변은 [첫 번째 실험의 모델별 상세 답변](01-experiment-answer-details.md)에서 확인할 수 있습니다.

## 이 실험에서 확인한 점

첫째, 전체를 한눈에 보는 이미지는 장비 위치와 반복 구조를 파악하는 데 유용합니다.

둘째, 작은 태그를 확인할 때에는 원본에서 관련 구역을 확대해야 합니다.

셋째, 확인한 확대 구역은 답변의 근거로 남기면 다른 사람이 같은 위치를 빠르게 검토할 수 있습니다.

따라서 이번 실험의 메시지는 다음과 같습니다.

> 전체 도면에서 위치를 찾고, 원본을 확대해 값을 읽고, 확인한 구역을 답변의 근거로 남깁니다.

## 원본 실행 결과

- 새 검증 가능 질문 실험: `experiments/single-image-prompt/results/verifiable-v3/`
- 원본 고해상도 전체 이미지 실험: `experiments/single-image-prompt/results/fullres-v1/`
- 확대 이미지 크기 정규화 실험: `experiments/single-image-prompt/results/normalized-crop-v1/`
- 사용한 질문: `experiments/single-image-prompt/prompts/`
- 전체 구조용 이미지: `assets/overview/sample-pid-overview-1600.png`
- Feeder #C 주변 확대 이미지: `assets/regions/feeder-c-area-long-edge-1600.png`

다음 단원에서는 전체 이미지로 위치를 찾고 부분 확대 이미지로 정확한 값을 읽는 과정을 하나의 이미지 입력 전략으로 연결합니다.

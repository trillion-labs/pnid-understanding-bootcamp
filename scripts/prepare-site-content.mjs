import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const contentDir = path.join(rootDir, 'src', 'content', 'docs');

const workbookPages = [
  ['00-course-design-principles.md', '이 워크북에서 무엇을 배우나요?', 'P&ID 도면을 AI 에이전트와 함께 읽고 평가하는 전체 흐름을 소개합니다.'],
  ['00-pid-primer.md', 'P&ID를 처음 읽는 분을 위한 안내', 'P&ID의 기본 구성요소와 전문가가 도면을 읽는 순서를 실제 예제로 익힙니다.'],
  ['01-program-design.md', '첫 번째 실험: P&ID 한 장을 얼마나 깊게 읽을 수 있을까요?', '같은 도면을 세 모델과 세 입력 조건으로 읽은 실제 결과를 비교합니다.'],
  ['02-visual-prompting-strategy.md', 'AI가 큰 P&ID를 읽도록 이미지를 준비하는 방법', '전체 이미지와 부분 확대 이미지를 연결하는 coarse-to-fine 입력 방식을 배웁니다.'],
  ['03-screenshot-and-bbox.md', 'AI의 답을 원본 위치와 연결하는 방법', '위치 상자와 텍스트 레이어로 AI 답변의 근거를 다시 찾을 수 있게 만듭니다.'],
  ['04-data-schema.md', 'AI의 답을 검색하고 비교할 수 있는 데이터로 바꾸는 방법', '자유로운 문장을 검토·검색·평가할 수 있는 구조화 데이터로 바꿉니다.'],
  ['05-agent-workflow.md', 'Claude Code와 Codex에게 도면 작업을 맡기는 방법', '입력, 규칙, 결과물, 완료 조건을 포함하는 에이전트 업무 계약을 만듭니다.'],
  ['06-evaluation.md', 'P&ID 에이전트의 답을 평가하는 방법', '도면 선택뿐 아니라 근거와 행동을 함께 보는 벤치마크 기준을 설계합니다.'],
  ['07-workshop-runbook.md', '강사용 60분 진행안', '핵심 실습을 60분 안에 운영하기 위한 준비물과 진행 순서입니다.'],
  ['08-prompt-cards.md', 'Claude Code·Codex 공통 프롬프트 카드', '탐색, 추출, 검증 목적에 따라 조정해 쓰는 요청문 모음입니다.'],
  ['09-file-to-image-reference.md', '원본 PDF에서 학습 이미지까지', 'PDF 점검, 렌더링, 확대 이미지 준비 과정을 재현합니다.'],
  ['10-quality-review.md', '초심자 관점 품질 검토 기록', '워크북의 용어, 흐름, 이미지, 데이터 일관성을 검토한 기록입니다.'],
  ['11-real-query-evaluation.md', '실제 GS Agent 쿼리로 검증하기', '현업 질문과 기존 실행 결과를 샘플 도면에 연결해 검토합니다.'],
  ['12-skill-experiment.md', '스킬을 추가하고 전후를 비교하는 실습', '반복 가능한 도면 읽기 지침을 스킬로 저장하고 A/B 평가합니다.'],
  ['13-codex-claude-best-practices.md', 'Codex와 Claude 실습 원칙', '제품별 모범 사례를 관찰 가능한 P&ID 실험으로 바꿉니다.'],
  ['14-benchmark-improvement-loop.md', '평가 결과로 에이전트를 개선하는 방법', '오류를 분류하고 한 가지만 바꾼 뒤 같은 조건으로 재평가합니다.'],
  ['15-workbook-grading-report.md', '워크북 품질 재평가 보고서', '초심자 친화성, 정확성, 연결성, 재현성을 기준으로 자료를 채점합니다.'],
];

const practicePages = [
  ['README.md', 'guide.md', '60분 실습 안내', '준비된 이미지로 도면 읽기, 근거 기록, 평가, 개선을 한 번에 따라 합니다.'],
  ['MY-WORK.md', 'my-work.md', '내 실습 기록지', '실행 조건, 관찰, 점수, 개선 전후 결과를 한곳에 기록합니다.'],
  ['EXTENSIONS.md', 'extensions.md', '확장 실습', '텍스트 레이어, 스킬 A/B, 추가 쿼리 평가를 더 깊게 수행합니다.'],
];

function withFrontmatter(source, title, description) {
  const withoutTopHeading = source.replace(/^\uFEFF?#\s+[^\n]+\n+/, '');
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n${withoutTopHeading}`;
}

function rewritePracticeLinks(source) {
  return source
    .replaceAll('../../assets/', '../assets/')
    .replaceAll('../../docs/', '../workbook/')
    .replaceAll('(README.md)', '(guide.md)')
    .replaceAll('(MY-WORK.md)', '(my-work.md)')
    .replaceAll('(EXTENSIONS.md)', '(extensions.md)');
}

const homePage = `---
title: 시작하기
description: Claude Code와 Codex로 실제 P&ID 도면을 읽고 평가하고 개선하는 실습형 워크북입니다.
template: splash
hero:
  title: 도면을 읽는 AI는 어떻게 만들어질까요?
  tagline: P&ID를 처음 보는 분도 실제 이미지를 따라가며 Claude Code와 Codex의 답을 검토하고, 근거를 데이터로 남기고, 개선 전후를 평가할 수 있습니다.
  actions:
    - text: 워크북 시작하기
      link: /pnid-understanding-bootcamp/workbook/00-course-design-principles/
      icon: right-arrow
      variant: primary
    - text: 60분 실습 바로가기
      link: /pnid-understanding-bootcamp/practice/guide/
      icon: clock
      variant: secondary
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## 이 워크북에서 완성하는 한 가지 흐름

<CardGrid>
  <Card title="1. 도면을 읽습니다" icon="magnifier">
    전체 도면으로 구조를 파악하고, 질문과 관련된 부분을 크게 보며 작은 태그와 연결을 확인합니다.
  </Card>
  <Card title="2. 근거를 남깁니다" icon="approve-check-circle">
    답변 문장만 저장하지 않고, 원본의 어느 위치에서 무엇을 확인했는지 함께 기록합니다.
  </Card>
  <Card title="3. 같은 기준으로 평가합니다" icon="analytics">
    Claude Code와 Codex의 결과를 정답, 근거, 추측 여부라는 같은 기준으로 비교합니다.
  </Card>
  <Card title="4. 하나를 바꾸고 다시 봅니다" icon="random">
    이미지, 데이터 구조, 프롬프트, 스킬 중 한 가지만 개선하고 같은 질문을 다시 실행합니다.
  </Card>
</CardGrid>

## 두 가지 시작 방법

처음부터 이해하고 싶다면 **워크북 안내 → P&ID 입문 → 첫 번째 실제 실험** 순서로 읽어 주세요. 개념이 실제 모델 답변과 자연스럽게 연결됩니다.

수업이나 짧은 체험이 목적이라면 **60분 실습 안내**로 바로 이동해도 됩니다. 필요한 이미지는 이미 준비되어 있으므로 별도의 PDF 변환부터 시작하지 않습니다.

> 이 사이트에 표시되는 도면 이미지는 회사명, 로고, 주소, 작성·검토자 영역을 마스킹한 교육용 사본입니다. 내부 원본 PDF와 개인 메타데이터가 포함된 export 파일은 공개 저장소와 사이트에 포함하지 않습니다.
`;

await rm(contentDir, { recursive: true, force: true });
await mkdir(path.join(contentDir, 'workbook'), { recursive: true });
await mkdir(path.join(contentDir, 'practice'), { recursive: true });

await writeFile(path.join(contentDir, 'index.mdx'), homePage, 'utf8');

for (const [fileName, title, description] of workbookPages) {
  const source = await readFile(path.join(rootDir, 'docs', fileName), 'utf8');
  await writeFile(
    path.join(contentDir, 'workbook', fileName),
    withFrontmatter(source, title, description),
    'utf8',
  );
}

for (const [sourceName, targetName, title, description] of practicePages) {
  const source = await readFile(
    path.join(rootDir, 'workshop', 'participant-kit', sourceName),
    'utf8',
  );
  await writeFile(
    path.join(contentDir, 'practice', targetName),
    withFrontmatter(rewritePracticeLinks(source), title, description),
    'utf8',
  );
}

await cp(path.join(rootDir, 'assets'), path.join(contentDir, 'assets'), {
  recursive: true,
});
await cp(
  path.join(rootDir, 'workshop', 'participant-kit', 'inputs'),
  path.join(contentDir, 'practice', 'inputs'),
  { recursive: true },
);

console.log(`Prepared ${workbookPages.length + practicePages.length + 1} site pages.`);

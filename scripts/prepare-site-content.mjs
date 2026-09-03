import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const contentDir = path.join(rootDir, 'src', 'content', 'docs');

const workbookPages = [
  ['00-course-design-principles.md', '이 워크북에서 무엇을 배우나요?', 'P&ID 도면을 AI 에이전트와 함께 읽고 평가하는 전체 흐름을 소개합니다.'],
  ['00-pid-primer.md', 'P&ID를 처음 읽는 분을 위한 안내', 'P&ID의 기본 구성요소와 전문가가 도면을 읽는 순서를 실제 예제로 익힙니다.'],
  ['01-program-design.md', '첫 번째 실험: 전체 도면에서 안 읽히던 태그를 확대하면 어떻게 될까요?', '전체 도면에서 발생한 판독 실패를 부분 확대 이미지로 개선하는 과정을 따라갑니다.'],
  ['01-experiment-answer-details.md', '첫 번째 실험의 모델별 상세 답변', 'Reception Bin 태그부터 전동기 태그까지 아홉 개 실제 답변과 항목별 점수를 모았습니다.'],
  ['02-visual-prompting-strategy.md', '이미지 입력 전략: 전체에서 찾고, 필요한 곳을 확대하기', '전체에서 위치를 찾고 관련 구역을 확대해 답하는 coarse-to-fine 방식을 배웁니다.'],
  ['02-ocr-for-agents.md', 'Tesseract OCR로 P&ID를 검색 가능하게 만들기', 'OCR 텍스트로 후보 위치를 찾고 원본 이미지로 검증하는 에이전트 검색 흐름을 배웁니다.'],
  ['03-screenshot-and-bbox.md', 'AI의 답을 원본 위치와 연결하는 방법', '위치 상자와 텍스트 레이어로 AI 답변의 근거를 다시 찾을 수 있게 만듭니다.'],
  ['04-pid-indexing.md', 'P&ID를 검색 가능한 데이터로 정리하는 방법', '도면의 기본정보, 한 줄 요약, 큰 구역과 주요 태그를 단계별 JSON으로 정리합니다.'],
  ['04-data-schema.md', 'AI의 답을 검색하고 비교할 수 있는 데이터로 바꾸는 방법', '자유로운 문장을 검토·검색·평가할 수 있는 구조화 데이터로 바꿉니다.'],
  ['05-agent-workflow.md', 'Claude Code와 Codex에게 도면 작업을 맡기는 방법', '입력, 규칙, 결과물, 완료 조건을 포함하는 에이전트 업무 계약을 만듭니다.'],
  ['05-terminal-claude-codex.mdx', '터미널에서 Claude Code와 Codex 실행하기', '명령을 직접 타이핑해 연습한 뒤 전체 이미지와 부분 확대 이미지 실험을 실행합니다.'],
  ['06-evaluation.md', 'P&ID 에이전트의 답을 평가하는 방법', '도면에 직접 적힌 네 값을 기준으로 판독 정확도와 근거를 평가합니다.'],
  ['08-prompt-cards.md', 'Claude Code·Codex 공통 프롬프트 카드', '탐색, 추출, 검증 목적에 따라 조정해 쓰는 요청문 모음입니다.'],
  ['09-file-to-image-reference.md', '원본 PDF에서 학습 이미지까지', 'PDF 점검, 렌더링, 확대 이미지 준비 과정을 재현합니다.'],
  ['12-skill-experiment.md', '스킬을 추가하고 전후를 비교하는 실습', '반복 가능한 도면 읽기 지침을 스킬로 저장하고 A/B 평가합니다.'],
  ['14-benchmark-improvement-loop.md', '평가 결과로 에이전트를 개선하는 방법', '오류를 분류하고 한 가지만 바꾼 뒤 같은 조건으로 재평가합니다.'],
];

function withFrontmatter(source, title, description) {
  const withoutTopHeading = source.replace(/^\uFEFF?#\s+[^\n]+\n+/, '');
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n${withoutTopHeading}`;
}

function rewriteWorkbookLinks(source) {
  return source.replace(
    /\]\(([^/()]+)\.mdx?(#[^)]+)?\)/g,
    (_match, fileName, anchor = '') => `](../${fileName}/${anchor})`,
  );
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

## 이 워크북을 읽는 순서

**워크북 안내 → P&ID 입문 → 첫 번째 실제 실험** 순서로 시작해 주세요. 이후에는 이미지 입력, 위치 근거, 구조화 데이터, 에이전트 운영, 평가와 개선이 하나의 흐름으로 이어집니다. 필요한 이미지는 이미 준비되어 있으므로 별도의 PDF 변환부터 시작하지 않습니다.

> 이 사이트에 표시되는 도면 이미지는 회사명, 로고, 주소, 작성·검토자 영역을 마스킹한 교육용 사본입니다. 내부 원본 PDF와 개인 메타데이터가 포함된 export 파일은 공개 저장소와 사이트에 포함하지 않습니다.
`;

await rm(contentDir, { recursive: true, force: true });
await mkdir(path.join(contentDir, 'workbook'), { recursive: true });

await writeFile(path.join(contentDir, 'index.mdx'), homePage, 'utf8');

for (const [fileName, title, description] of workbookPages) {
  const source = await readFile(path.join(rootDir, 'docs', fileName), 'utf8');
  await writeFile(
    path.join(contentDir, 'workbook', fileName),
    withFrontmatter(rewriteWorkbookLinks(source), title, description),
    'utf8',
  );
}

await cp(path.join(rootDir, 'assets'), path.join(contentDir, 'assets'), {
  recursive: true,
});

const downloadsDir = path.join(rootDir, 'public', 'downloads');
await mkdir(downloadsDir, { recursive: true });
await cp(
  path.join(rootDir, 'assets', 'ocr', 'sample-pid-searchable-improved.pdf'),
  path.join(downloadsDir, 'sample-pid-searchable-improved.pdf'),
);

console.log(`Prepared ${workbookPages.length + 1} site pages.`);

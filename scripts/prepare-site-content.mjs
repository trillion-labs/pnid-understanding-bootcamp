import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const contentDir = path.join(rootDir, 'src', 'content', 'docs');

const workbookPages = [
  ['00-course-design-principles.md', '이 워크북에서 무엇을 배우나요?', 'P&ID 도면을 AI 에이전트와 함께 읽고 평가하는 전체 흐름을 소개합니다.'],
  ['00-pid-primer.md', 'P&ID를 처음 읽는 분을 위한 안내', 'P&ID의 기본 구성요소와 전문가가 도면을 읽는 순서를 실제 예제로 익힙니다.'],
  ['01-program-design.md', '첫 번째 실험: 작은 태그는 확대하면 더 잘 읽을까요?', '전체에서 위치를 찾고 관련 구역을 확대해 작은 태그를 확인하는 과정을 따라갑니다.'],
  ['01-experiment-answer-details.md', '첫 번째 실험의 모델별 상세 답변', 'Reception Bin 태그부터 전동기 태그까지 아홉 개 실제 답변과 항목별 점수를 모았습니다.'],
  ['02-visual-prompting-strategy.md', '이미지 입력 전략: 전체에서 찾고, 필요한 곳을 확대하기', '전체에서 위치를 찾고 관련 구역을 확대해 답하는 coarse-to-fine 방식을 배웁니다.'],
  ['02-ocr-for-agents.md', 'Tesseract OCR로 검색 가능한 P&ID 만들기', '도구를 설치하고 검색 가능한 PDF를 만든 뒤 OCR 텍스트와 원본 이미지를 함께 사용하는 흐름을 배웁니다.'],
  ['03-screenshot-and-bbox.md', 'AI의 답을 원본 위치와 연결하는 방법', '위치 상자와 텍스트 레이어로 AI 답변의 근거를 다시 찾을 수 있게 만듭니다.'],
  ['04-pid-indexing.md', 'P&ID를 검색 가능한 데이터로 정리하는 방법', '도면의 기본정보, 한 줄 요약, 큰 구역과 주요 태그를 단계별 JSON으로 정리합니다.'],
  ['04-data-schema.md', 'AI의 답을 검색하고 비교할 수 있는 데이터로 바꾸는 방법', '자유로운 문장을 검토·검색·평가할 수 있는 구조화 데이터로 바꿉니다.'],
  ['05-agent-workflow.md', 'AI에게 도면 작업을 맡기는 방법', '목표, 입력, 판단 규칙, 출력과 완료 조건을 포함한 요청문을 만듭니다.'],
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
title: P&ID × AI Agent 실습 워크북
description: Claude Code와 Codex로 실제 P&ID 도면을 읽고 평가하고 개선하는 실습형 워크북입니다.
template: splash
hero:
  title: P&ID × AI Agent 실습 워크북
  tagline: 실제 P&ID 한 장으로 도면 읽기부터 이미지 확대, OCR 검색과 근거 기록까지 직접 따라갑니다.
  actions:
    - text: 워크북 시작하기
      link: /pnid-understanding-bootcamp/workbook/00-course-design-principles/
      icon: right-arrow
      variant: primary
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## 무엇을 직접 해보나요?

<CardGrid>
  <Card title="도면에서 위치 찾기" icon="magnifier">
    제목란과 반복 구조를 확인하고 Reception Bin 2와 Feeder #C가 있는 구역을 찾습니다.
  </Card>
  <Card title="모델 답변 비교하기" icon="analytics">
    전체 이미지와 부분 확대 이미지를 Claude Code와 Codex에 입력해 실제 답변을 비교합니다.
  </Card>
  <Card title="검색하고 근거 남기기" icon="approve-check-circle">
    OCR로 태그를 검색하고, 답을 다시 확인할 수 있도록 원본 위치와 도면 색인을 남깁니다.
  </Card>
  <Card title="AI에게 작업 맡기기" icon="random">
    목표, 입력 파일, 판단 규칙과 완료 조건을 정리해 재사용할 수 있는 업무 요청문을 만듭니다.
  </Card>
</CardGrid>

## 시작하는 순서

먼저 **워크북 안내 → P&ID 입문 → 첫 번째 실제 실험** 순서로 시작하세요. 이후에는 왼쪽 사이드바의 번호를 따라 진행하면 됩니다.

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
  path.join(rootDir, 'assets', 'ocr', 'sample-pid-ocr.pdf'),
  path.join(downloadsDir, 'sample-pid-ocr.pdf'),
);

console.log(`Prepared ${workbookPages.length + 1} site pages.`);

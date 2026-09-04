import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const contentDir = path.join(rootDir, 'src', 'content', 'docs');
const learningDir = path.join(rootDir, '학습자료');
const practiceDir = path.join(rootDir, '실습자료');

const workbookPages = [
  ['00-워크북-안내.md', 'guide', '워크북 안내', 'P&ID 도면을 AI 에이전트와 함께 읽고 평가하는 전체 흐름을 소개합니다.'],
  ['01-pnid-기초.md', '01-pid-primer', 'P&ID 입문', 'P&ID의 기본 구성요소와 전문가가 도면을 읽는 순서를 실제 예제로 익힙니다.'],
  ['02-첫번째-실험.md', '02-first-experiment', '이미지 확대와 프롬프트 비교 실험', '전체 이미지, 상세 프롬프트와 부분 확대 이미지의 판독 결과를 같은 기준으로 비교합니다.'],
  ['03-이미지-입력-전략.md', '03-image-input-strategy', '이미지 입력 전략', '전체에서 위치를 찾고 관련 구역을 확대해 답하는 coarse-to-fine 방식을 배웁니다.'],
  ['04-ocr-검색.md', '04-ocr-search', 'OCR로 도면 검색하기', '도구를 설치하고 검색 가능한 PDF를 만든 뒤 OCR 텍스트와 원본 이미지를 함께 사용하는 흐름을 배웁니다.'],
  ['05-근거-위치-표시.md', '05-evidence-location', 'AI 답변을 원본 위치와 연결하기', '위치 상자와 텍스트 레이어를 사용해 AI 답변의 근거를 원본 도면에서 다시 찾을 수 있게 만듭니다.'],
  ['06-pnid-데이터-정리.md', '06-pid-indexing', 'P&ID 데이터 정리', '도면의 기본정보, 한 줄 요약, 큰 구역과 주요 태그를 단계별 JSON으로 정리합니다.'],
  ['07-ai에게-작업-맡기기.md', '07-agent-workflow', 'AI에게 도면 작업 맡기기', '목표, 입력, 판단 규칙, 출력과 완료 조건을 포함한 요청문을 만듭니다.'],
];

const outputSlugBySource = new Map(
  workbookPages.map(([fileName, slug]) => [path.resolve(learningDir, fileName), slug]),
);

function withFrontmatter(source, title, description) {
  const withoutTopHeading = source.replace(/^\uFEFF?#\s+[^\n]+\n+/, '');
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n${withoutTopHeading}`;
}

function rewriteWorkbookLinks(source, sourcePath) {
  return source.replace(
    /\]\(([^()]+\.mdx?)(#[^)]+)?\)/g,
    (match, target, anchor = '') => {
      const resolved = path.resolve(path.dirname(sourcePath), target);
      const slug = outputSlugBySource.get(resolved);
      return slug ? `](../${slug}/${anchor})` : match;
    },
  ).replace(/\]\((?:\.\.\/)+실습자료\//g, '](../assets/');
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
      link: /pnid-understanding-bootcamp/workbook/guide/
      icon: right-arrow
      variant: primary
    - text: 실습 키트 받기
      link: /pnid-understanding-bootcamp/downloads/pnid-ai-workbook-kit.zip
      icon: download
      variant: secondary
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

먼저 **워크북 안내 → P&ID 입문 → 이미지 확대·프롬프트 비교** 순서로 시작하세요. 이후에는 왼쪽 사이드바의 번호를 따라 진행하면 됩니다.

> 이 사이트에 표시되는 도면 이미지는 회사명, 로고, 주소, 작성·검토자 영역을 마스킹한 교육용 사본입니다. 내부 원본 PDF와 개인 메타데이터가 포함된 export 파일은 공개 저장소와 사이트에 포함하지 않습니다.
`;

await rm(contentDir, { recursive: true, force: true });
await mkdir(path.join(contentDir, 'workbook'), { recursive: true });

await writeFile(path.join(contentDir, 'index.mdx'), homePage, 'utf8');

for (const [fileName, slug, title, description] of workbookPages) {
  const sourcePath = path.join(learningDir, fileName);
  const source = await readFile(sourcePath, 'utf8');
  await writeFile(
    path.join(contentDir, 'workbook', `${slug}.md`),
    withFrontmatter(rewriteWorkbookLinks(source, sourcePath), title, description),
    'utf8',
  );
}

await cp(practiceDir, path.join(contentDir, 'assets'), {
  recursive: true,
});

const downloadsDir = path.join(rootDir, 'public', 'downloads');
await mkdir(downloadsDir, { recursive: true });
await cp(
  path.join(practiceDir, '이미지', '원본-고해상도-도면.png'),
  path.join(downloadsDir, '원본-고해상도-도면.png'),
);
await cp(
  path.join(practiceDir, 'ocr', '검색가능한-pnid.pdf'),
  path.join(downloadsDir, '검색가능한-pnid.pdf'),
);

console.log(`Prepared ${workbookPages.length + 1} site pages.`);

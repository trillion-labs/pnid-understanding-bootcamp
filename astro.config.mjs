import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://trillion-labs.github.io',
  base: '/pnid-understanding-bootcamp',
  redirects: {
    '/workbook/00-course-design-principles/': '/pnid-understanding-bootcamp/workbook/guide/',
    '/workbook/00-pid-primer/': '/pnid-understanding-bootcamp/workbook/01-pid-primer/',
    '/workbook/01-program-design/': '/pnid-understanding-bootcamp/workbook/02-first-experiment/',
    '/workbook/02-visual-prompting-strategy/': '/pnid-understanding-bootcamp/workbook/03-image-input-strategy/',
    '/workbook/02-ocr-for-agents/': '/pnid-understanding-bootcamp/workbook/04-ocr-search/',
    '/workbook/03-screenshot-and-bbox/': '/pnid-understanding-bootcamp/workbook/05-evidence-location/',
    '/workbook/04-pid-indexing/': '/pnid-understanding-bootcamp/workbook/06-pid-indexing/',
    '/workbook/05-agent-workflow/': '/pnid-understanding-bootcamp/workbook/07-agent-workflow/',
  },
  integrations: [
    starlight({
      title: 'P&ID × AI Agent Workbook',
      description:
        'Claude Code와 Codex로 P&ID 도면을 읽고, 근거를 구조화하고, 평가와 개선 Loop까지 수행하는 실습형 워크북입니다.',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      locales: {
        root: {
          label: '한국어',
          lang: 'ko',
        },
      },
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      pagefind: true,
      credits: false,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      sidebar: [
        {
          label: '핵심 워크북',
          items: [
            { label: '워크북 안내', link: '/workbook/guide/' },
            { label: '1. P&ID 입문', link: '/workbook/01-pid-primer/' },
            { label: '2. 이미지 확대·프롬프트 비교', link: '/workbook/02-first-experiment/' },
            { label: '3. 이미지 입력 전략', link: '/workbook/03-image-input-strategy/' },
            { label: '4. OCR로 도면 검색하기', link: '/workbook/04-ocr-search/' },
            { label: '5. AI 답변을 원본 위치와 연결하기', link: '/workbook/05-evidence-location/' },
            { label: '6. P&ID 데이터 정리', link: '/workbook/06-pid-indexing/' },
            { label: '7. AI에게 도면 작업 맡기기', link: '/workbook/07-agent-workflow/' },
          ],
        },
      ],
    }),
  ],
});

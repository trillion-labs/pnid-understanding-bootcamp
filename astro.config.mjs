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
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: '핵심 워크북',
          items: [
            { label: '워크북 안내', link: '/workbook/guide/' },
            { label: '1. P&ID 입문', link: '/workbook/01-pid-primer/' },
            { label: '2. 첫 번째 실제 실험', link: '/workbook/02-first-experiment/' },
            { label: '3. 이미지 입력 전략', link: '/workbook/03-image-input-strategy/' },
            { label: '4. Tesseract OCR로 검색 가능한 P&ID 만들기', link: '/workbook/04-ocr-search/' },
            { label: '5. 위치 상자와 텍스트 레이어', link: '/workbook/05-evidence-location/' },
            { label: '6. P&ID를 검색 가능한 데이터로 정리하기', link: '/workbook/06-pid-indexing/' },
            { label: '7. AI에게 도면 작업 맡기기', link: '/workbook/07-agent-workflow/' },
          ],
        },
        {
          label: '워크북 부록',
          collapsed: true,
          items: [
            { label: '첫 실험 상세 답변', link: '/workbook/01-experiment-answer-details/' },
            { label: '프롬프트 카드', link: '/workbook/08-prompt-cards/' },
            { label: 'PDF에서 이미지 준비', link: '/workbook/09-file-to-image-reference/' },
            { label: '스킬 추가 전후 실험', link: '/workbook/12-skill-experiment/' },
          ],
        },
      ],
    }),
  ],
});

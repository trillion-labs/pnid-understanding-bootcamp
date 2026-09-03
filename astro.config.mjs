import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://trillion-labs.github.io',
  base: '/pnid-understanding-bootcamp',
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
      social: [
        {
          icon: 'github',
          label: 'GitHub 저장소',
          href: 'https://github.com/trillion-labs/pnid-understanding-bootcamp',
        },
      ],
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
        { label: '시작하기', link: '/' },
        {
          label: '핵심 워크북',
          items: [
            { label: '워크북 안내', link: '/workbook/00-course-design-principles/' },
            { label: 'P&ID 입문', link: '/workbook/00-pid-primer/' },
            { label: '첫 번째 실제 실험', link: '/workbook/01-program-design/' },
            { label: '이미지 입력 전략', link: '/workbook/02-visual-prompting-strategy/' },
            { label: 'Tesseract OCR과 에이전트 검색', link: '/workbook/02-ocr-for-agents/' },
            { label: '위치 상자와 텍스트 레이어', link: '/workbook/03-screenshot-and-bbox/' },
            { label: 'P&ID를 검색 가능한 데이터로 정리하기', link: '/workbook/04-pid-indexing/' },
            { label: 'AI 답변 구조화', link: '/workbook/04-data-schema/' },
            { label: 'Claude Code와 Codex 운영', link: '/workbook/05-agent-workflow/' },
            { label: '터미널에서 직접 실행하기', link: '/workbook/05-terminal-claude-codex/' },
            { label: '평가 기준', link: '/workbook/06-evaluation/' },
            { label: '개선 과정', link: '/workbook/14-benchmark-improvement-loop/' },
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

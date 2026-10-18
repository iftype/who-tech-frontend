import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, type BrowserContext, type Page } from '@playwright/test';

// 주요 페이지를 기본 디자인(paper)의 라이트·다크로 찍어 기준 이미지와 비교한다.
// API는 fixture-server의 녹화 응답, 시각은 녹화 시각으로 고정되어 같은 화면이 나온다
const { recordedAt } = JSON.parse(readFileSync(path.join(process.cwd(), 'e2e/visual/fixtures/meta.json'), 'utf8')) as {
  recordedAt: string;
};

// GitHub 아바타 대신 쓰는 1x1 회색 PNG
const AVATAR_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGO4c+cOAAVyArlJ6S8yAAAAAElFTkSuQmCC',
  'base64',
);

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'cohort-list', path: '/cohort' },
  { name: 'cohort-detail', path: '/cohort/7' },
  { name: 'member', path: '/iftype' },
  { name: 'settings', path: '/settings' },
  { name: 'guide', path: '/guide' },
  { name: 'stats', path: '/stats' },
  { name: 'not-found', path: '/__no_such_member__' },
] as const;

const THEMES = ['light', 'dark'] as const;

async function open(page: Page, context: BrowserContext, baseURL: string, theme: string, pagePath: string) {
  await context.addCookies([{ name: 'theme', value: theme, url: baseURL }]);
  await page.clock.setFixedTime(new Date(recordedAt));
  await page.route(/\/_next\/image\?|avatars\.githubusercontent\.com/, (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: AVATAR_PNG }),
  );
  await page.goto(pagePath, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}

for (const theme of THEMES) {
  for (const { name, path: pagePath } of PAGES) {
    test(`${name} (${theme})`, async ({ page, context, baseURL }) => {
      await open(page, context, baseURL!, theme, pagePath);
      await expect(page).toHaveScreenshot(`${name}-${theme}.png`, { fullPage: true });
    });
  }

  // 클릭·입력 후에만 보이는 화면 (리팩토링 대상인 프로필 탭과 검색 드롭다운)
  test(`member blog tab (${theme})`, async ({ page, context, baseURL }) => {
    await open(page, context, baseURL!, theme, '/iftype');
    const loaded = page.waitForResponse((res) => res.url().includes('/blog-posts') && res.ok());
    await page.getByRole('button', { name: '블로그 글' }).click();
    await loaded;
    await expect(page.getByText('블로그 글을 불러오는 중')).toHaveCount(0);
    await expect(page).toHaveScreenshot(`member-blog-${theme}.png`, { fullPage: true });
  });

  test(`search dropdown (${theme})`, async ({ page, context, baseURL }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', '모바일은 검색창이 메뉴 안에 있어 데스크톱만 확인');
    await open(page, context, baseURL!, theme, '/cohort');
    const searched = page.waitForResponse((res) => res.url().includes('/api/members?') && res.ok());
    await page.getByPlaceholder('닉네임 / ID 검색').fill('콘티');
    await searched;
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`search-${theme}.png`);
  });
}

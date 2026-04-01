import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';

const shots = [
  {
    id: 'search',
    url: '/',
    clip: null, // full viewport
    waitFor: null,
  },
  {
    id: 'detail',
    url: '/iftype',
    clip: null,
    waitFor: null,
  },
  {
    id: 'cohort',
    url: '/cohort',
    clip: null,
    waitFor: null,
  },
  {
    id: 'feed',
    url: '/feed',
    clip: null,
    waitFor: null,
  },
  {
    id: 'stats',
    url: '/stats',
    clip: null,
    waitFor: null,
  },
];

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  colorScheme: 'dark',
});

for (const shot of shots) {
  const page = await context.newPage();
  await page.goto(`${BASE}${shot.url}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.screenshot({
    path: `public/guide/${shot.id}.png`,
    clip: shot.clip ?? undefined,
  });

  console.log(`✓ ${shot.id}.png`);
  await page.close();
}

await browser.close();
console.log('완료');

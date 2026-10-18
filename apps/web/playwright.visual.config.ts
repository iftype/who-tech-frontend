import { defineConfig, devices } from '@playwright/test';

// 화면 스크린샷 비교 테스트 (ARCHITECTURE_PLAN A-1). 구조 리팩토링이 화면을 바꾸지 않았는지 픽셀 단위로 확인한다.
// 빌드는 NEXT_PUBLIC_API_URL=http://127.0.0.1:4010 으로 미리 해 둔다 (pnpm --filter @who-tech/web build:visual)
// 기준 이미지는 CI(Linux)에서 만든다. 로컬(macOS)은 폰트 렌더링이 달라 비교 대상이 아니다
const PORT = 3100;

export default defineConfig({
  testDir: './e2e/visual',
  testMatch: '*.visual.ts',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{projectName}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]] : 'list',
  expect: { toHaveScreenshot: { maxDiffPixels: 0 } },
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: 'node e2e/visual/fixture-server.mjs',
      url: 'http://127.0.0.1:4010/__ready',
      reuseExistingServer: !process.env.CI,
    },
    {
      // fetch 캐시를 비우고 시작한다. 남아 있으면 시각이 고정돼 만료되지 않아 예전 응답이 계속 쓰인다
      command: `node -e "require('fs').rmSync('.next/cache/fetch-cache',{recursive:true,force:true})" && next start -p ${PORT} -H 127.0.0.1`,
      url: `http://127.0.0.1:${PORT}/stats`,
      env: { NODE_OPTIONS: '--import ./e2e/visual/server-preload.mjs' },
      reuseExistingServer: !process.env.CI,
    },
  ],
});

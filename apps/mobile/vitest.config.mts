import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// RN 렌더러 없이 jsdom에서 렌더해 구조·스타일을 비교한다. react-native는 src/test의 스텁으로 대체
export default defineConfig({
  resolve: {
    alias: { 'react-native': fileURLToPath(new URL('./src/test/react-native.tsx', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.tsx'],
  },
});

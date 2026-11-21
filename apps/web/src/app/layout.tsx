import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import { cookies } from 'next/headers';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { parseDesign, parseTheme } from '@/shared/providers/theme';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { Navbar, PATCH_TOAST_COOKIE, PatchToast, isPatchDismissed } from '@/widgets/layout';
import './globals.css';

const rubik = Rubik({ subsets: ['latin'], variable: '--font-rubik' });

export const metadata: Metadata = {
  title: 'who.tech',
  description: '우아한테크코스 크루 검색 서비스',
  openGraph: {
    type: 'website',
    siteName: 'who.tech',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  // 쿠키의 테마를 서버에서 읽어 <html>에 바로 올린다 → 첫 그림에 깜빡임이 없다 (그 대가로 모든 경로가 동적 렌더링, ADR 0004)
  const theme = parseTheme(cookieStore.get('theme')?.value);
  const design = parseDesign(cookieStore.get('designSystem')?.value);
  // 패치 안내 띠도 쿠키로 정해 HTML에 같이 그린다 → 하이드레이션 뒤에 띠가 끼어들어 본문을 밀지 않는다
  const patchToastVisible = !isPatchDismissed(cookieStore.get(PATCH_TOAST_COOKIE)?.value);

  const htmlClass = [
    GeistSans.variable,
    GeistMono.variable,
    rubik.variable,
    theme === 'dark' ? 'dark' : '',
    design !== 'paper' ? design : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <html lang="ko" suppressHydrationWarning className={htmlClass}>
      <body className="min-h-screen bg-bg font-sans">
        <ThemeProvider initialTheme={theme} initialDesign={design}>
          <QueryProvider>
            <Navbar />
            <PatchToast initialVisible={patchToastVisible} />
            <main>{children}</main>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

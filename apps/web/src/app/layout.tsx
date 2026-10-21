import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Rubik } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/widgets/layout/Navbar';
import { PatchToast } from '@/widgets/layout/PatchToast';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { parseDesign, parseTheme } from '@/shared/providers/theme';

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
            <PatchToast />
            <main>{children}</main>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

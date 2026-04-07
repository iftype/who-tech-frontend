import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Rubik } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { QueryProvider } from '@/components/layout/QueryProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const rubik = Rubik({ subsets: ['latin'], variable: '--font-rubik' });

export const metadata: Metadata = {
  title: {
    default: 'who.tech',
    template: '%s | who.tech',
  },
  description: '우아한테크코스 크루 검색 서비스',
  openGraph: {
    type: 'website',
    siteName: 'who.tech',
  },
};

type Theme = 'dark' | 'light';
type DesignSystem = 'paper' | 'apple' | 'sentry';

const VALID_THEMES: Theme[] = ['dark', 'light'];
const VALID_DESIGNS: DesignSystem[] = ['paper', 'apple', 'sentry'];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const rawTheme = cookieStore.get('theme')?.value;
  const rawDesign = cookieStore.get('designSystem')?.value;

  const theme: Theme = VALID_THEMES.includes(rawTheme as Theme) ? (rawTheme as Theme) : 'dark';
  const design: DesignSystem = VALID_DESIGNS.includes(rawDesign as DesignSystem)
    ? (rawDesign as DesignSystem)
    : 'paper';

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
            <main>{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

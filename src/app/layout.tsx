import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { QueryProvider } from '@/components/layout/QueryProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark', t!=='light');})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg font-sans">
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main>{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

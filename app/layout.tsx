import type { Metadata } from 'next';

import { Link } from '@/ui';
import { BASE_URL } from '@/lib/env';
import { cn } from '@/lib/utils';

import './globals.css';
import { inter } from './fonts';
import { AnalyticsWrapper } from './components/analytics';

export const metadata = {
  title: 'Pattern Analyzer | Home',
  description: 'X-Wing tournament data & statistics',
  applicationName: 'Pattern Analyzer',
  appleWebApp: {
    title: 'Pattern Analyzer',
  },
  openGraph: {
    siteName: 'Pattern Analyzer',
    title: 'Home',
    description: 'X-Wing Tournament data & statistics',
    images: `${BASE_URL}/api/og.png`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@sebastiansebald',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3c4073' },
    { media: '(prefers-color-scheme: dark)', color: '#96a6e3' },
  ],
  other: {
    'msapplication-TileColor': '#96a6e3',
  },
} satisfies Metadata;

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en" className={cn(inter.variable, 'font-sans')}>
    <body className="flex min-h-screen flex-col bg-primary-50">
      {children}
      <footer className="mx-auto mt-auto w-[min(100%_-_3rem,_75rem)] pt-16">
        <div className="flex items-center justify-center gap-6 border-t border-primary-200 px-2 pb-4 pt-2 text-sm text-primary-300">
          <Link href="/">Home</Link>
          <Link href="https://github.com/sebald/pattern-analyzer">Source</Link>
          <Link href="/about">About</Link>
        </div>
      </footer>
      <AnalyticsWrapper />
    </body>
  </html>
);

export default Layout;

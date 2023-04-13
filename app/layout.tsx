import type { Metadata } from 'next';

import { Link } from '@/ui';
import { cn } from '@/lib/utils';

import './globals.css';
import { inter } from './fonts';
import { AnalyticsWrapper } from './components/analytics';

export const metadata: Metadata = {
  title: 'Pattern Analyzer | Home',
  openGraph: {
    siteName: 'Pattern Analyzer',
    title: 'Home',
    description: 'X-Wing Tournament data & statistics',
    images: ['https://pattern-analyzer-git-metadata-sebald.vercel.app/api/og'],
    locale: 'en-US',
    type: 'website',
  },
};

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

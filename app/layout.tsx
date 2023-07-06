import type { Metadata } from 'next';

import { Link } from '@/ui';
import { baseUrl } from '@/lib/config';
import { cn } from '@/lib/utils';

import './globals.css';
import { sans } from './fonts';
import { AnalyticsWrapper } from './components/analytics';
import { SiteHeader } from './components/site-header';
import { SiteFooter } from './components/site-footer';

// Metadata
// ---------------
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
    images: `${baseUrl}/api/og.png`,
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

// Props
// ---------------
export interface LayoutProps {
  children: React.ReactNode;
}

// Layout
// ---------------
const Layout = ({ children }: LayoutProps) => (
  <html lang="en">
    <body
      className={cn(
        sans.variable,
        'flex min-h-screen flex-col bg-primary-50 font-sans'
      )}
    >
      <SiteHeader />
      <main className="container flex flex-1 pb-10 pt-12">{children}</main>
      <SiteFooter />
      <AnalyticsWrapper />
    </body>
  </html>
);

export default Layout;

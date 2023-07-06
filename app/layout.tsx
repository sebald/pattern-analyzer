import type { Metadata } from 'next';

import { Container } from '@/ui';
import { baseUrl } from '@/lib/config';
import { cn } from '@/lib/utils';

import './globals.css';
import { sans } from './fonts';
import { AnalyticsWrapper } from './_components/analytics';
import { SiteHeader } from './_components/site-header';
import { SiteFooter } from './_components/site-footer';

// Metadata
// ---------------
export const metadata = {
  title: 'Pattern Analyzer | Home',
  description: 'X-Wing tournament data & statistics',
  applicationName: 'Pattern Analyzer',
  appleWebApp: {
    title: 'Pattern Analyzer',
  },
  metadataBase: new URL('https://www.pattern-analyzer.app/'),
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
      <Container className="flex flex-1 flex-col pb-10 pt-12 md:pt-20">
        {children}
      </Container>
      <SiteFooter />
      <AnalyticsWrapper />
    </body>
  </html>
);

export default Layout;

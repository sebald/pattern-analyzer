import { Container } from '@/ui';
import { getLastSync } from '@/lib/db/system';
import { createMetadata } from '@/lib/metadata';
import { cn } from '@/lib/utils';

import './globals.css';
import { sans } from './fonts';
import { AnalyticsWrapper } from './_components/analytics';
import { SiteHeader } from './_components/site-header';
import { SiteFooter } from './_components/site-footer';

// Metadata
// ---------------
export const metadata = createMetadata({ title: 'Home' });

// Props
// ---------------
export interface LayoutProps {
  children: React.ReactNode;
}

// Layout
// ---------------
const Layout = async ({ children }: LayoutProps) => {
  const lastSync = await getLastSync();

  return (
    <html lang="en">
      <body
        className={cn(
          sans.variable,
          'flex min-h-screen flex-col bg-primary-50 font-sans'
        )}
      >
        <SiteHeader />
        <Container className="flex flex-1 flex-col pb-10 pt-8 md:pt-20">
          {children}
        </Container>
        <SiteFooter lastUpdate={lastSync} />
        <AnalyticsWrapper />
      </body>
    </html>
  );
};

export default Layout;

import { Link } from '@/ui';
import { cn } from '@/lib/utils';

import './globals.css';
import { inter } from './fonts';
import { AnalyticsWrapper } from './components/analytics';

export const metadata = {
  title: 'Pattern Analyzer | Home',
};

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="en" className={cn(inter.variable, 'font-sans')}>
    <head>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
    </head>
    <body className="flex min-h-screen flex-col bg-body-light md:bg-body">
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

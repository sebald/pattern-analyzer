import { BASE_URL } from '@/lib/env';
import { Container, Link, Logo } from '@/ui';

// Metadata
// ---------------
export const metadata = {
  title: 'Pattern Analyzer | Analyze',
  description: 'Analyze the current X-Wing meta!',
  openGraph: {
    siteName: 'Pattern Analyzer',
    title: 'Analyze',
    description: 'Analyze the current X-Wing meta!',
    images: `${BASE_URL}/api/og.png?title`,
    locale: 'en-US',
    type: 'website',
  },
};

// Component
// ---------------
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <nav className="px-2 py-2 text-center leading-none xl:px-6">
      <Link className="inline-block" href="/">
        <Logo className="h-7 w-7 text-primary-400 hover:text-primary-900 lg:h-9 lg:w-9" />
      </Link>
    </nav>
    <main className="pt-5 lg:pt-5">
      <Container>{children}</Container>
    </main>
  </>
);

export default Layout;

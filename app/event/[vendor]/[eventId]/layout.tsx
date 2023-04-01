import { Caption, Container, Inline, Link, Logo, Title } from '@/ui';
import { Trophy, Computed } from '@/ui/icons';

import { getEventDataByVendor } from '@/lib/get-event';
import { Vendor } from '@/lib/types';

import { AboutParsingDialog } from './components/about-parsing-dialog';

// Props
// ---------------
interface LayoutProps {
  children: React.ReactNode;
  params: {
    vendor: Vendor;
    eventId: string;
  };
}

// Metadata
// ---------------
export const generateMetadata = async ({ params }: LayoutProps) => {
  return {
    title: `Pattern Analyzer | Event #${params.eventId}`,
  };
};

// Components
// ---------------
const Layout = async ({ params, children }: LayoutProps) => {
  const event = await getEventDataByVendor({
    vendor: params.vendor,
    ids: params.eventId,
  });

  const squadsWithXWS = event.squads.filter(item => Boolean(item.xws));

  return (
    <Container>
      <header className="mb-4 border-b border-b-primary-100 pb-6 md:mt-3">
        <Title>{event.title || 'Unknown Event'}</Title>
        <Caption>
          <Inline className="gap-4">
            {event.urls.map(({ href, text }) => (
              <Link key={href} href={href} target="_blank">
                <Inline className="whitespace-nowrap">
                  <Trophy className="h-3 w-3" /> {text}
                </Inline>
              </Link>
            ))}
            <Inline className="whitespace-nowrap">
              <Computed className="h-3 w-3" /> {squadsWithXWS.length}/
              {event.squads.length} Squads parsed <AboutParsingDialog />
            </Inline>
          </Inline>
        </Caption>
      </header>
      {children}
    </Container>
  );
};

export default Layout;

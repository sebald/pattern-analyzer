import { Caption, Container, Inline, Link, Title } from '@/ui';
import { Navigation } from '@/ui/navigation';
import { Trophy, Computed, Lines, Download, BarChart } from '@/ui/icons';

import { getEventDataByVendor } from '@/lib/get-event';
import { Vendor } from '@/lib/types';

import { AboutParsingDialog } from './components/about-parsing-dialog';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
// export const revalidate = 300;

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
      <Navigation
        className="pb-14"
        path={`/event/${params.vendor}/${params.eventId}`}
        items={[
          {
            label: (
              <>
                <Lines className="hidden h-5 w-5 sm:block" />
                Squads
              </>
            ),
          },
          {
            label: (
              <>
                <BarChart className="hidden h-5 w-5 sm:block" />
                Stats
              </>
            ),
            slug: 'stats',
          },
          {
            label: (
              <>
                <Download className="hidden h-5 w-5 sm:block" />
                Export
              </>
            ),
            slug: 'export',
          },
        ]}
      />
      {children}
    </Container>
  );
};

export default Layout;

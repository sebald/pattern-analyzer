import type { Metadata } from 'next';

import { Caption, Inline, Link, Title } from '@/ui';
import { Navigation } from '@/ui/navigation';
import { Trophy, Lines, Download, BarChart } from '@/ui/icons';

import { baseUrl } from '@/lib/env';
import type { EventInfo, Vendor } from '@/lib/types';

// Config
// ---------------
export const revalidate = 300; // 5min

// Data
// ---------------
interface GetEventInfoProps {
  vendor: Vendor;
  id: string;
}

const getEventInfo = async ({ vendor, id }: GetEventInfoProps) => {
  const res = await fetch(`${baseUrl}/api/${vendor}/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch event info... (${vendor}/${id})`);
  }

  const info = await res.json();
  return info as EventInfo;
};

// Props
// ---------------
interface LayoutProps {
  children: React.ReactNode;
  params: {
    vendor: Vendor;
    id: string;
  };
}

// Metadata
// ---------------
export const generateMetadata = async ({ params }: LayoutProps) => {
  const event = await getEventInfo({
    vendor: params.vendor,
    id: params.id,
  });

  return {
    title: `Pattern Analyzer | ${event.name}`,
    description: 'View squads & stats',
    openGraph: {
      siteName: 'Pattern Analyzer',
      title: event.name,
      description: 'X-Wing Tournament data & statistics',
      images: `${baseUrl}/api/og.png?title=${encodeURIComponent(event.name)}`,
      locale: 'en-US',
      type: 'website',
    },
  } satisfies Metadata;
};

// Component
// ---------------
const Layout = async ({ params, children }: LayoutProps) => {
  const event = await getEventInfo({
    vendor: params.vendor,
    id: params.id,
  });

  return (
    <>
      <header className="mb-4 border-b border-b-primary-100 pb-6 md:mt-3">
        <Title>{event.name || 'Unknown Event'}</Title>
        <Caption>
          <Inline className="gap-4">
            <Link href={event.url} target="_blank">
              <Inline className="whitespace-nowrap">
                <Trophy className="h-3 w-3" /> Event #{params.id}
              </Inline>
            </Link>
          </Inline>
        </Caption>
      </header>
      <Navigation
        className="pb-14"
        path={`/event/${params.vendor}/${params.id}`}
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
    </>
  );
};

export default Layout;

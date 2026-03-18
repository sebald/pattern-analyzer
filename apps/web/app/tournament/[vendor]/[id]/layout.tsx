import { notFound } from 'next/navigation';

import { Caption, Inline, Link, Title } from '@/ui';
import { Trophy, Calendar } from '@/ui/icons';

import { baseUrl, vendors } from '@/lib/config';
import { createMetadata } from '@/lib/metadata';
import type { EventInfo, Vendor } from '@/lib/types';
import { formatDate, fromDate } from '@/lib/utils/date.utils';

import { Navigation } from './_components/navigation';

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
  if (!vendors.find(v => v.id === vendor)) {
    notFound();
  }

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

  return createMetadata({
    title: event.name,
    description: 'View Squads & Stats',
    ogTitle: event.name,
  });
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
      <div className="pb-6">
        <Title>{event.name || 'Unknown Event'}</Title>
        <Caption>
          <Inline className="gap-4">
            <Inline className="whitespace-nowrap">
              <Calendar className="h-3 w-3" />
              {formatDate(fromDate(event.date))}
            </Inline>
            <Link href={event.url} target="_blank">
              <Inline className="whitespace-nowrap">
                <Trophy className="h-3 w-3" /> Event #{params.id}
              </Inline>
            </Link>
          </Inline>
        </Caption>
      </div>
      <Navigation className="my-6" {...params} />
      {children}
    </>
  );
};

export default Layout;

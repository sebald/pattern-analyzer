import { redirect } from 'next/navigation';

import { RECENT_EVENTS } from 'app/preload';
import { Center, Container, Message } from '@/components';
import { BarChart, Download, Lines } from '@/components/icons';
import { getEventDataByVendor } from '@/lib/get-event';

// Friendly reminder: Don't use a barrel file! next doesn't like it!
import { Export } from './components/export-data';
import { Filter } from './components/filter';
import { FilterProvider } from './components/filter-context';
import { PageHeader } from './components/page-header';
import { Squads } from './components/squads';
import { Stats } from './components/stats';
import { Tabs } from './components/tabs';

/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 60;
export const fetchCache = 'force-cache';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => {
  const events = RECENT_EVENTS;
  events.rollbetter.push('56+57');

  return Object.entries(events)
    .map(([vendor, ids]) => ids.map(id => ({ event: [vendor, id] })))
    .flat();
};

// Props
// ---------------
export interface PageProps {
  params: {
    event: [id: string] | [vendor: string, id: string] | string[];
  };
}

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  /**
   * Make URLs backwards compatible by defaulting to
   * longshanks if vendor is missing
   */
  if (params.event.length === 1) {
    redirect(`/event/longshanks/${params.event[0]}`);
  }

  // Nope out if there are more than two event params ...
  if (params.event.length > 2 || params.event.length < 1) {
    redirect(`/`);
  }

  const [vendor, id] = params.event as [
    vendor: 'longshanks' | 'rollbetter',
    id: string
  ];
  const event = await getEventDataByVendor({
    vendor,
    ids: id,
  });

  return (
    <Container>
      <PageHeader event={event} />
      {event.squads.length > 1 ? (
        <Tabs
          labels={[
            {
              id: 'squads',
              content: (
                <>
                  <Lines className="hidden h-5 w-5 sm:block" />
                  Squads
                </>
              ),
            },
            {
              id: 'stats',
              content: (
                <>
                  <BarChart className="hidden h-5 w-5 sm:block" />
                  Stats
                </>
              ),
            },
            {
              id: 'export',
              content: (
                <>
                  <Download className="hidden h-5 w-5 sm:block" />
                  Export
                </>
              ),
            },
          ]}
          defaultTab="squads"
        >
          <FilterProvider>
            <Filter />
            <Squads squads={event.squads} />
          </FilterProvider>
          <Stats squads={event.squads} />
          <Export event={event} />
        </Tabs>
      ) : (
        <div className="pt-4">
          <Center>
            <Message>
              <Message.Title>No squads found.</Message.Title>
              Looks like the event is not an X-Wing event or squads are still
              hidden.
            </Message>
          </Center>
        </div>
      )}
    </Container>
  );
};

export default Page;

import { redirect } from 'next/navigation';

import { RECENT_EVENTS } from 'app/preload';
import { Caption, Center, Container, Link, Message, Title } from 'components';
import { Computed, Download, Trophy } from 'components/icons';
import { getEventDataByVendor } from 'lib/get-event';

// Friendly reminder: Don't use a barrel file! next doesn't like it!
import { Filter } from './components/filter';
import { FilterProvider } from './components/filter-context';
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
  const squadsWithXWS = event.squads.filter(item => Boolean(item.xws)).length;

  return (
    <main className="p-4">
      <Container>
        <header className="mb-4 border-b border-b-primary-100 pb-6 md:mt-3">
          <Title>{event.title || 'Unknown Event'}</Title>
          <Caption className="flex flex-row gap-4">
            {event.urls.map(({ href, text }) => (
              <Link key={href} href={href} target="_blank">
                <Trophy className="h-3 w-3" /> {text}
              </Link>
            ))}
            <span className="flex items-center gap-1">
              <Computed className="h-3 w-3" /> {squadsWithXWS}/
              {event.squads.length} Squads parsed
            </span>
            <Link
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(event.squads)
              )}`}
              download={`${event.title.replace(/\s/g, '_')}.json`}
            >
              <Download className="h-3 w-3" /> Download
            </Link>
          </Caption>
        </header>
        {event.squads.length > 1 ? (
          <Tabs
            labels={[
              {
                id: 'squads',
                content: (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Squads
                  </>
                ),
              },
              {
                id: 'stats',
                content: (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M12 9a1 1 0 01-1-1V3c0-.553.45-1.008.997-.93a7.004 7.004 0 015.933 5.933c.078.547-.378.997-.93.997h-5z" />
                      <path d="M8.003 4.07C8.55 3.992 9 4.447 9 5v5a1 1 0 001 1h5c.552 0 1.008.45.93.997A7.001 7.001 0 012 11a7.002 7.002 0 016.003-6.93z" />
                    </svg>
                    Stats
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
          </Tabs>
        ) : (
          <div className="pt-4">
            <Center>
              <Message>
                <strong>No squads found.</strong>
                <br />
                Looks like the event is not an X-Wing event or squads are still
                hidden.
              </Message>
            </Center>
          </div>
        )}
      </Container>
    </main>
  );
};

export default Page;

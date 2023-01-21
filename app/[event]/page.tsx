import { RECENT_EVENTS } from 'app/preload';
import { Caption, Center, Container, Link, Message, Title } from 'components';
import { getEvent } from 'lib/longshanks';
import type { XWSSquad } from 'lib/types';

import { Filter } from './components/filter';
import { FilterProvider } from './components/filter-context';
import { Squads } from './components/squads';

/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 60;
export const fetchCache = 'force-cache';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export async function generateStaticParams() {
  return RECENT_EVENTS.map(event => ({ event }));
}

// Props
// ---------------
export interface PageProps {
  params: {
    event: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  const { title, url, squads } = await getEvent(params.event);
  const squadsWithXWS = squads.filter(item => Boolean(item.xws)) as {
    id: string;
    url: string;
    xws: XWSSquad;
    raw: string;
    player: string;
  }[];

  if (squadsWithXWS.length === 0) {
    return (
      <div className="pt-4">
        <Center>
          <Message>
            <strong>No list founds.</strong>
            <br />
            Looks like the event has no squads including a links to YASB.
          </Message>
        </Center>
      </div>
    );
  }

  return (
    <main className="p-4">
      <div>
        <Title>{title || `Event #${params.event}`}</Title>
        <Caption>
          <Link href={url} target="_blank">
            Event #{params.event}
          </Link>{' '}
          ({squadsWithXWS.length}/{squads.length} squads parsed)
        </Caption>
      </div>
      <Container>
        <FilterProvider>
          <Filter />
          <Squads squads={squadsWithXWS} />
        </FilterProvider>
      </Container>
    </main>
  );
};

export default Page;

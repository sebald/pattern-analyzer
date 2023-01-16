import { Caption, Center, Message, Title } from 'components';
import { getEvent } from 'lib/longshanks';
import type { XWSSquad } from 'lib/xws';

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
  return [];
}

export interface PageProps {
  params: {
    event: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { title, players } = await getEvent(params.event);
  const squadsWithXWS = players.filter(({ squad }) => Boolean(squad.xws));

  if (squadsWithXWS.length === 0) {
    return (
      <div className="pt-4">
        <Center>
          <Message>
            <strong>No list founds.</strong>
            <br />
            Looks like the event has no squads including a link to YASB.
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
          Showing {squadsWithXWS.length}/{players.length} lists
        </Caption>
      </div>
      <div className="mx-auto my-4 w-[min(100%_-_3rem,_75rem)]">
        <FilterProvider>
          <Filter />
          <Squads squads={squadsWithXWS} />
        </FilterProvider>
      </div>
    </main>
  );
};

export default Page;

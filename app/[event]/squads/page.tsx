import { Caption, Center, Link, Message, Title } from 'components';
import { getEventHtml, parseSquads } from 'lib/longshanks';
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
  const { html } = await getEventHtml(params.event);
  const squads = await parseSquads(html);

  const squadsWithXWS = squads.filter(squad => Boolean(squad.xws)) as {
    id: string;
    url: string;
    xws: XWSSquad;
    raw: string;
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
    <div className="mx-auto my-4 w-[min(100%_-_3rem,_75rem)]">
      <FilterProvider>
        <Filter />
        <Squads squads={squadsWithXWS} />
      </FilterProvider>
    </div>
  );
};

export default Page;

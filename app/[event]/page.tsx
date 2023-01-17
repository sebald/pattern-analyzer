import { load } from 'cheerio';

import { Caption, Center, Message, Title } from 'components';
import { XWSSquad, yasb2xws } from 'lib/xws';

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

// Data
// ---------------
const getEvent = async (event: string) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/?event=${event}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const html = await res.text();
  const $ = load(html);

  // Scrape event title from meta tag.
  const title = $('head meta[property=og:title]').attr('content') || null;

  /**
   * Iterate over all player related html and scrape their name
   * and squad.
   */
  const squads = await Promise.all(
    $('[class=pop][id^=details_]')
      .toArray()
      .map(async el => {
        const player = $('.player_link', el).text();

        const list = $('[id^=list_]', el);
        const id = list.attr('id');
        const raw = list.attr('value') || '';

        // Get XWS for YASB link
        const YASB_REGEXP =
          /https:\/\/yasb\.app\/\?f(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;
        const url = (raw.replace(/(\r\n|\n|\r)/gm, '').match(YASB_REGEXP) || [
          null,
        ])[0];
        let xws: XWSSquad | null = null;
        try {
          xws = await yasb2xws(url || '');
        } catch {
          throw new Error('Could not load XWS...');
        }

        return {
          id,
          url,
          xws,
          raw,
          player,
        };
      })
  );

  return { title, squads };
};

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
  const { title, squads } = await getEvent(params.event);
  const squadsWithXWS = squads.filter(item => Boolean(item.xws)) as {
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
          Showing {squadsWithXWS.length}/{squads.length} lists
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

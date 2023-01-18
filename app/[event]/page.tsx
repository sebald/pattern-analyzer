import { Caption, Center, Link, Message, Title } from 'components';
import { yasb2xws } from 'lib/data';
import { getEvent } from 'lib/longshanks';
import { XWSSquad } from 'lib/xws';

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
  const { title, url, squads } = await getEvent(params.event);
  const squadsWithXWS = squads.filter(item => Boolean(item.xws)) as {
    id: string;
    url: string;
    xws: XWSSquad;
    raw: string;
    player: string;
  }[];

  console.log(
    yasb2xws(
      'https://yasb.app/?f=Resistance&d=v9ZhZ20Z442X119W172W198WWWW175W136Y298X125W206WW359WW175WY607X172WWW197WW175WY350X127W172WW54WY349XWW188W&sn=xXx&obs=yt2400debris2'
    )
  );
  console.log(
    yasb2xws(
      'https://yasb.app/?f=Scum%20and%20Villainy&d=v9ZhZ20Z132X119W375WWW134Y133X375WW136Y473XWW339W91WWY85X375W138W134WW5WWWY458X375WWW136WWW&sn=Darth%20Johnny&obs=pomasteroid1'
    )
  );

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

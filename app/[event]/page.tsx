import { Caption, Card, Link, Squad, Tiles, Title } from 'components';
import type { XWSSquad } from 'lib/xws';

const YASB_REGEXP = /https:\/\/yasb\.app\/\?f(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

const getXWS = async (url: string) => {
  // Currently only supporting YASB links
  if (!/yasb\.app/.test(url)) {
    return null;
  }

  // Get XWS using https://github.com/zacharyp/squad2xws
  const res = await fetch(
    url.replace(
      'https://yasb.app',
      'https://squad2xws.objectivecat.com/yasb/xws'
    ),
    { next: { revalidate: 86400 } } // Keep data 1 day
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch XWS data for ${url}...`);
  }

  let xws;
  try {
    xws = await res.json();
  } catch {
    throw new Error(`Failed to parse JSON for ${url}...`);
  }

  return xws as XWSSquad;
};

const getListsFromEvent = async (event: string) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/?event=${event}`,
    { next: { revalidate: 3600 } } // Keep data 1 hour
  );

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  // Poor mans web scraper...
  const html = await res.text();
  const matches = html.matchAll(
    /id=\"list_(?<id>\d+)\" value=\"(?<value>[^"]*)\"/g
  );

  const lists = await Promise.all(
    Array.from(matches).map(async m => {
      const val = m.groups?.value || '';
      const id = m.groups?.id!;
      const url = (val.replace(/(\r\n|\n|\r)/gm, '').match(YASB_REGEXP) || [
        null,
      ])[0];
      const xws = await getXWS(url || '');

      return {
        id,
        url,
        xws,
        raw: val,
      };
    })
  );

  return lists;
};

export interface PageProps {
  params: {
    event: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const data = await getListsFromEvent(params.event);
  const dataWithXWS = data.filter(item => Boolean(item.xws));

  return (
    <main className="p-4">
      <Title>Event #{params.event}</Title>
      <Caption>
        Showing {dataWithXWS.length}/{data.length} lists
      </Caption>
      <div className="mx-auto my-4 w-[min(100%_-_3rem,_75rem)]">
        <Tiles>
          {dataWithXWS.map(item => (
            <Card key={item.id}>
              <Card.Body>
                <Squad xws={item.xws!} />
              </Card.Body>
              <Card.Footer>
                <Link
                  className="text-xs text-secondary-300"
                  href={item.url!}
                  target="_blank"
                >
                  View in YASB
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </Tiles>
      </div>
    </main>
  );
};

export default Page;

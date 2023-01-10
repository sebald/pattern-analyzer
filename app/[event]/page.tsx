import { Title } from 'components/title';

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
    )
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch XWS data for ${url}...`);
  }

  let xws: any = null;
  try {
    xws = await res.json();
  } catch {
    throw new Error(`Failed to parse JSON for ${url}...`);
  }

  return xws;
};

const getListsFromEvent = async (event: string) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/?event=${event}`
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
      const url = (val.replace(/\n/g, ' ').match(YASB_REGEXP) || [null])[0];
      const xws = await getXWS(url || '');

      return {
        id,
        url,
        xws,
        // TODO: add plain value to object if no link can be found
      };
    })
  );

  return lists;
};

export interface PageParams {
  params: {
    event: string;
  };
}

const Page = async ({ params }: PageParams) => {
  const data = await getListsFromEvent(params.event);

  return (
    <main>
      <Title>Event #{params.event}</Title>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.id}: {item.url}
            <br />
            {item.xws && JSON.stringify(item.xws)}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;

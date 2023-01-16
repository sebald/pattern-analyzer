import { yasb2xws } from 'lib/xws';

const YASB_REGEXP = /https:\/\/yasb\.app\/\?f(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

export const parseTitle = (html: string) => {
  const match = html.match(/property=\"og:title\" content=\"(?<title>[^"]*)\"/);
  return match?.groups?.title || null;
};

export const parseSquads = async (html: string) => {
  // Get the contents of the popup
  const matches = html.matchAll(
    /id=\"list_(?<id>\d+)\" value=\"(?<value>[^"]*)\"/g
  );

  // Transform YASB links to XWS
  const squads = await Promise.all(
    Array.from(matches).map(async m => {
      const val = m.groups?.value || '';
      const id = m.groups?.id!;
      const url = (val.replace(/(\r\n|\n|\r)/gm, '').match(YASB_REGEXP) || [
        null,
      ])[0];
      const xws = await yasb2xws(url || '');

      return {
        id,
        url,
        xws,
        raw: val,
      };
    })
  );

  return squads;
};

export const getEvent = async (event: string) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/?event=${event}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const html = await res.text();

  const title = parseTitle(html);
  const squads = await parseSquads(html);

  return { title, squads };
};

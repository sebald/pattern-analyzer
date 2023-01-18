import { yasb2xws } from 'lib/xws';
import { load } from 'cheerio';

/**
 * Scrape event title from meta tag.
 */
export const parseTitle = (html: string) => {
  const $ = load(html);
  return $('head meta[property=og:title]').attr('content') || null;
};

/**
 * Iterate over all player related html and scrape their name
 * and squad.
 */
export const parseSquads = async (html: string) => {
  const $ = load(html);

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
        const xws = await yasb2xws(url || '');

        return {
          id,
          url,
          xws,
          raw,
          player,
        };
      })
  );

  return squads;
};

/**
 * Fetch an event page from longhanks and use it to
 * scrape data.
 */
export const getEventHtml = async (event: string) => {
  const url = `https://longshanks.org/events/detail/?event=${event}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const html = await res.text();

  return { url, html };
};

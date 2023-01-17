import { yasb2xws } from 'lib/xws';
import { CheerioAPI, load } from 'cheerio';

/**
 * Scrape event title from meta tag.
 */
export const parseTitle = ($: CheerioAPI) =>
  $('head meta[property=og:title]').attr('content') || null;

/**
 * Iterate over all player related html and scrape their name
 * and squad.
 */
export const parseSquads = async ($: CheerioAPI) =>
  await Promise.all(
    $('[class=pop][id^=details_]')
      .toArray()
      .map(async el => {
        const player = $('.player_link', el).text();
        console.log(player);

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

/**
 * Fetch an event page from longhanks and use it to
 * scrape data.
 */
export const getEvent = async (event: string) => {
  const url = `https://longshanks.org/events/detail/?event=${event}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const html = await res.text();
  const $ = load(html);

  const title = parseTitle($);
  const squads = await parseSquads($);

  return { url, title, squads };
};

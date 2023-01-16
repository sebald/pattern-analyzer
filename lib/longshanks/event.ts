import { yasb2xws } from 'lib/xws';
import { CheerioAPI, load } from 'cheerio';

const YASB_REGEXP = /https:\/\/yasb\.app\/\?f(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

/**
 * Get event title from meta tag.
 */
export const parseTitle = ($: CheerioAPI) =>
  $('head meta[property=og:title]').attr('content') || null;

/**
 * Iterate over all player related html and get their name
 * and squad.
 */
export const parsePlayers = async ($: CheerioAPI) =>
  await Promise.all(
    $('[class=pop][id^=details_]')
      .toArray()
      .map(async el => {
        const name = $('.player_link', el).text();

        const list = $('[id^=list_]', el);
        const id = list.attr('id');
        const raw = list.attr('value') || '';

        // Get XWS for YASB link
        const url = (raw.replace(/(\r\n|\n|\r)/gm, '').match(YASB_REGEXP) || [
          null,
        ])[0];
        const xws = await yasb2xws(url || '');

        return {
          name,
          squad: {
            id,
            url,
            xws,
            raw,
          },
        };
      })
  );

export const getEvent = async (event: string) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/?event=${event}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const html = await res.text();
  const $ = load(html);

  const title = parseTitle($);
  const players = await parsePlayers($);

  return { title, players };
};

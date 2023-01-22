import { CheerioAPI, load } from 'cheerio';
import { yasb2xws } from './yasb2xws';

/**
 * Scrape event title from meta tag.
 */
export const parseTitle = ($: CheerioAPI) =>
  $('head meta[property=og:title]').attr('content') || null;

/**
 * Scrape event date and description from meta tag.
 */
export const parseDescription = ($: CheerioAPI) => {
  const content =
    $('head meta[property=og:description]').attr('content') || null;

  if (!content) {
    return { date: null, description: null };
  }

  const [date, description] = content.split(' • ');
  return { date, description };
};

/**
 * Iterate over all player related html and scrape their name
 * and squad.
 */
export const parseSquads = ($: CheerioAPI) =>
  $('[class=pop][id^=details_]')
    .toArray()
    .map(el => {
      const player = $('.player_link', el).first().text();

      const list = $('[id^=list_]', el);
      const id = list.attr('id')!;
      const raw = list.attr('value') || '';

      /**
       * Try to find a YASB link and convert it to XWS.
       */
      const YASB_REGEXP =
        /https:\/\/yasb\.app\/\?f(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=,]*)/;
      const url = (raw.replace(/(\r\n|\n|\r)/gm, '').match(YASB_REGEXP) || [
        null,
      ])[0];
      const xws = url ? yasb2xws(url) : null;

      return {
        id,
        url,
        xws,
        raw,
        player,
      };
    });

export const getEventHtml = async (event: string) => {
  const url = `https://longshanks.org/events/detail/?event=${event}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const html = await res.text();
  return { url, html };
};

/**
 * Fetch an event page from longhanks and scrape title and
 * event data.
 */
export const getEvent = async (event: string) => {
  const { url, html } = await getEventHtml(event);
  const $ = load(html);

  const title = parseTitle($);
  const squads = parseSquads($);

  return { url, title, squads };
};

/**
 * Fetch an event page from longhanks and scrape title,
 * .
 */
export const getEventInfo = async (event: string) => {
  const { url, html } = await getEventHtml(event);
  const $ = load(html);

  const title = parseTitle($);
  const { date, description } = parseDescription($);

  return { url, id: event, title, date, description };
};

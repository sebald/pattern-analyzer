import { CheerioAPI, load } from 'cheerio';
import { SquadsData } from './types';
import { yasb2xws, YASB_URL_REGEXP } from './yasb2xws';

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
export const parseSquads = ($: CheerioAPI): SquadsData[] =>
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
      const url = (raw.replace(/(\r\n|\n|\r)/gm, '').match(YASB_URL_REGEXP) || [
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

export const getEventHtml = async (id: string) => {
  const url = `https://longshanks.org/events/detail/?event=${id}`;
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
export const getEvent = async (id: string) => {
  const { url, html } = await getEventHtml(id);
  const $ = load(html);

  const title = parseTitle($);
  const squads = parseSquads($);

  return { url, title, squads };
};

/**
 * Fetch an event page from longhanks and scrape title,
 * .
 */
export const getEventInfo = async (id: string) => {
  const { url, html } = await getEventHtml(id);
  const $ = load(html);

  const title = parseTitle($);
  const { date, description } = parseDescription($);

  return { url, id, title, date, description };
};

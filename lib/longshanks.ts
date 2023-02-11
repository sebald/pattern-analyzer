import { CheerioAPI, load } from 'cheerio';
import { PlayerData, SquadData } from './types';
import { yasb2xws, YASB_URL_REGEXP } from './yasb';

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
 * Scrape player data. Note that longshanks handles teams the same
 * way but we can later connect the "real" players via ids from lists.
 */
export const parsePlayerInfo = ($: CheerioAPI): PlayerData[] =>
  $('.player .data')
    .toArray()
    .map(el => {
      const id = $('.id_number', el).first().text().replace('#', '');
      const player = $('.player_link', el).first().text();

      const rank = Number(
        $('.rank', el.parent).first().text().replace('(drop)', '').trim()
      );

      const points = Number($('.stat.mono.skinny.desktop', el).first().text());
      const record = {
        wins: Number($('.wins', el).first().text().trim()),
        ties: Number($('.ties', el).first().text().trim()),
        loss: Number($('.loss', el).first().text().trim()),
      };

      const stats = $('.stat.mono table td', el);
      const sos = Number(stats.first().text().trim());
      const mov = Number(stats.last().text().trim());

      return {
        id,
        player,
        rank,
        points,
        record,
        sos,
        mov,
      };
    });

/**
 * Iterate over all player related html and scrape their name
 * and squad. Also add player performance data if possible.
 */
export const parseSquads = (
  $: CheerioAPI,
  players: PlayerData[]
): SquadData[] =>
  $('[class=pop][id^=details_]')
    .toArray()
    .map(el => {
      const player = $('.player_link', el).first().text();
      const id = el.attribs.id.replace('details_', '');

      const list = $('[id^=list_]', el);
      const raw = list.attr('value') || '';

      /**
       * Try to find a YASB link and convert it to XWS.
       */
      const url = (raw.replace(/(\r\n|\n|\r)/gm, '').match(YASB_URL_REGEXP) || [
        null,
      ])[0];
      const xws = url ? yasb2xws(url) : null;

      const performance = players.find(player => player.id === id) || {};

      return {
        id,
        url,
        xws,
        raw,
        player,
        ...performance,
      };
    });

export const getEventHtml = async (id: string) => {
  const url = `https://longshanks.org/events/detail/?event=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch event data... (${id})`);
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
  const players = parsePlayerInfo($);
  const squads = parseSquads($, players);
  console.log(players);
  return { id, url, title, squads };
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

  return { url, id, vendor: 'longshanks', title, date, description };
};

import { CheerioAPI, load } from 'cheerio';
import type { ListFortressRound, PlayerData, SquadData } from './types';
import { yasb2xws, YASB_URL_REGEXP } from './yasb';

/**
 * Scrape event title from meta tag.
 */
export const parseTitle = ($: CheerioAPI) =>
  $('head meta[property=og:title]').attr('content') || 'Unknown Event';

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

      const groups = $('.rank', el.parent)
        .first()
        .text()
        .trim()
        .match(/^(?<rank>\d+)\s*\((?<info>[a-z]+)/)?.groups || {
        rank: 0,
        info: '',
      };
      const rank = Number(groups.rank);
      const dropped = groups.info === 'drop';

      const points = Number($('.stat.mono.skinny.desktop', el).first().text());
      const record = {
        wins: Number($('.wins', el).first().text().trim()),
        ties: Number($('.ties', el).first().text().trim()),
        losses: Number($('.loss', el).first().text().trim()),
      };

      const stats = $('.stat.mono table td', el);
      const sos = Number(stats.first().text().trim());
      const missionPoints = Number(stats.eq(1).text().trim());
      const mov = Number(stats.eq(2).text().trim());

      return {
        id,
        player,
        rank,
        points,
        record,
        sos,
        missionPoints,
        mov,
        dropped,
      };
    });

/**
 * Iterate over all the popups to find the games played by each player.
 */
export const parseRounds = ($: CheerioAPI) => {
  const games = new Set<string>();
  const rounds = new Map<number, ListFortressRound>();

  const toMatchId = (round: number, ids: string[]) => {
    const copy = [...ids].sort();
    return `${round}:${copy.join('-')}`;
  };

  $('[class=pop][id^=details_]')
    .toArray()
    .forEach(el => {
      $('.game', el)
        .toArray()
        .forEach(game => {
          const details = $('.details .item', game);
          const roundNumber = Number(details.eq(1).children().eq(1).text());

          const ids = $('.results .player .id_number', game)
            .toArray()
            .map(pid => $(pid).text().replace('#', ''));

          // Check if we already added the game
          const matchId = toMatchId(roundNumber, ids);
          if (games.has(matchId)) {
            return;
          }
          // Add macht so we don't add it twice
          games.add(matchId);

          // Get or create round
          const round =
            rounds.get(roundNumber) ||
            ({
              'round-type': 'swiss',
              'round-number': roundNumber,
              matches: [],
              scenario: details.eq(2).children().eq(1).text().trim(),
            } as ListFortressRound);

          const players = $('.results .player .player_link', game)
            .toArray()
            .map(p => $(p).text().trim());
          const score = $('.results .player .score', game)
            .toArray()
            .map(pid => Number($(pid).text()));

          // Add match to round.
          round.matches.push({
            player1: players[0],
            'player1-id': ids[0],
            player1Points: score[0],
            player2: players[1] || 'BYE',
            'player2-id': players[1],
            player2Points: score[1],
          });

          rounds.set(roundNumber, round);
        });
    });

  return [...rounds.values()];
};

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

      // Map player to his performance
      const performance = players.find(player => player.id === id) || {
        rank: 0,
        points: 0,
        record: { wins: 0, ties: 0, losses: 0 },
        sos: 0,
        missionPoints: 0,
        mov: 0,
      };

      return {
        ...performance,
        id,
        url,
        xws,
        raw,
        player,
      };
    })
    .sort((a, b) => a.rank - b.rank);

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
  const rounds = parseRounds($);

  return { id, url, title, squads, rounds };
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

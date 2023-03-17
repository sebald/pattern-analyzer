import { load, CheerioAPI, Element } from 'cheerio';

import type {
  ListFortressRound,
  PlayerData,
  Scenarios,
  SquadData,
} from './types';
import { getBuilderLink, toXWS } from './xws';
import { yasb2xws, YASB_URL_REGEXP } from './yasb';

export const getEventHtml = async (id: string) => {
  const url = `https://longshanks.org/events/detail/?event=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch event data... (${id})`);
  }

  const html = await res.text();
  return { url, html };
};

export const getEventSection = async (
  id: string,
  section: 'player' | 'player_cut'
) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/panel_standings.php?event=${id}&section=${section}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch section data... (${id}, ${section})`);
  }

  return await res.text();
};

export const getXWS = (raw: string) => {
  // Remove new lines, makes it easier to regex on it
  const val = raw.replace(/(\r\n|\n|\r)/gm, '');

  // XWS
  if (raw.startsWith('{')) {
    try {
      const xws = toXWS(raw);
      return {
        xws,
        url: getBuilderLink(xws),
      };
    } catch {
      /**
       * If there is an error parsing the JSON,
       * try the other options.
       */
    }
  }

  // YASB
  const url = (val.match(YASB_URL_REGEXP) || [null])[0];
  if (url) {
    return { xws: yasb2xws(url), url };
  }

  // Nothing :(
  return { xws: null, url };
};

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
export const parsePlayerInfo = async (id: string): Promise<PlayerData[]> => {
  // Fetch partial HTML
  const [playerHtml, cutHtml] = await Promise.all([
    getEventSection(id, 'player'),
    getEventSection(id, 'player_cut'),
  ]);
  const $ = load(playerHtml);

  // Helpers
  const getPlayerId = (el: Element) =>
    $('.id_number', el).first().text().replace('#', '');
  const getRankingInfo = (el: Element) => {
    const groups = $('.rank', el.parent)
      .first()
      .text()
      .trim()
      .match(/^(?<rank>\d+)(\s*\((?<info>[a-z]+))?/)?.groups || {
      rank: 0,
      info: '',
    };
    return {
      rank: Number(groups.rank),
      dropped: groups.info === 'drop',
    };
  };

  // Cut data
  const cut = new Map<string, number>();
  load(cutHtml)('.player .data')
    .toArray()
    .map(el => {
      const id = getPlayerId(el);
      const { rank } = getRankingInfo(el);

      cut.set(id, rank);
    });

  // Swiss data
  return $('.player .data')
    .toArray()
    .map(el => {
      const id = getPlayerId(el);
      const player = $('.player_link', el).first().text();

      const { rank: swiss, dropped } = getRankingInfo(el);
      const elimination = cut.get(id);

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
        rank: {
          swiss,
          elimination,
        },
        points,
        record,
        sos,
        missionPoints,
        mov,
        dropped,
      };
    });
};

/**
 * Iterate over all the popups to find the games played by each player.
 */
export const parseRounds = ($: CheerioAPI) => {
  const getRoundInfo = (el: Element) => {
    const id = el.attribs.id;
    return {
      type: id.includes('cut') ? 'elimination' : 'swiss',
      number: Number((id.match(/\d+$/) || ['0'])[0]),
    } as const;
  };

  /**
   * Get scenario from first game. We except the same
   * scenario is played in each round
   */
  const getScenario = (el: Element) =>
    $('.game .details .item', el)
      .eq(2)
      .children()
      .eq(1)
      .text()
      .trim() as Scenarios;

  return $('#edit_games [class="edit"][id^=edit_]')
    .toArray()
    .map(el => {
      const round = getRoundInfo(el);

      const matches = $('.game', el)
        .toArray()
        .map(game => {
          // Ids of the players playing against each other
          const ids = $('.results .player .id_number', game)
            .toArray()
            .map(pid => $(pid).text().replace('#', ''));
          // Player names
          const players = $('.results .player .player_link', game)
            .toArray()
            .map(p => $(p).text().trim());
          const score = $('.results .player .score', game)
            .toArray()
            .map(pid => Number($(pid).text()));

          return {
            player1: players[0],
            'player1-id': ids[0],
            player1Points: score[0],
            player2: players[1] || 'BYE',
            'player2-id': ids[1],
            player2Points: score[1],
          };
        });

      return {
        'round-type': round.type,
        'round-number': round.number,
        matches,
        scenario: getScenario(el),
      } satisfies ListFortressRound;
    });
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
      const { url, xws } = getXWS(raw);

      // Map player to their performance
      const performance = players.find(player => player.id === id) || {
        rank: { swiss: 0 },
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
    });

/**
 * Fetch an event page from longhanks and scrape title and
 * event data.
 */
export const getEvent = async (id: string) => {
  const { url, html } = await getEventHtml(id);
  const $ = load(html);

  const title = parseTitle($);
  const players = await parsePlayerInfo(id);
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

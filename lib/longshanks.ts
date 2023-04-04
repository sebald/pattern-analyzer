import { load, CheerioAPI, Element } from 'cheerio';

import type {
  ListFortressRound,
  PlayerData,
  PlayerRecord,
  Scenarios,
  SquadData,
} from './types';
import { getBuilderLink, toXWS } from './xws';
import { xwsFromText } from './yasb';

// Fetch
// ---------------
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

export const getEventRounds = async (
  id: string,
  info: { swiss: number; cut: number }
) => {
  const allRounds = [
    ...Array.from({ length: info.swiss }, (_, i) => i + 1),
    ...Array.from({ length: info.cut }, (_, i) => (i + 1) * -1),
  ];
  const result = await Promise.all(
    allRounds.map(async round => {
      const res = await fetch(
        `https://longshanks.org/events/detail/games/round.php?event=${id}&round=${round}&rounds=${info.swiss}&cut=${info.cut}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch round from longshanks...');
      }

      return res.text();
    })
  );

  return result.map(
    (html, idx) =>
      ({
        type: allRounds[idx] > 0 ? 'swiss' : 'elimination',
        number: Math.abs(allRounds[idx]),
        html,
      } as const)
  );
};

// Helpers
// ---------------
export const getRoundsInfoFromHTML = (html: string) => {
  try {
    const { args } = html.match(
      /load\("\/events\/detail\/games\/round\.php\?(?<args>.*)\)/
    )!.groups!;

    // Get round and cut number from args (cut is optional)
    const { swiss, cut } = args.match(
      /(?<swiss>\d+)(&cut=(?<cut>\d+))?\s#games/
    )!.groups!;
    return {
      swiss: Number(swiss),
      cut: Number(cut) || 0,
    };
  } catch {
    console.log('Oh noes... the round info regex does not work anymore!');
    return { swiss: 0, cut: 0 };
  }
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
  return xwsFromText(val);
};

// Parsers
// ---------------
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
  const combineRecords = (swiss: PlayerRecord, cut?: PlayerRecord) =>
    ({
      wins: swiss.wins + (cut?.wins || 0),
      ties: swiss.ties + (cut?.ties || 0),
      losses: swiss.losses + (cut?.losses || 0),
    } satisfies PlayerRecord);

  // Cut data
  const cut = new Map<string, { rank: number; record: PlayerRecord }>();
  load(cutHtml)('.player .data')
    .toArray()
    .map(el => {
      const id = getPlayerId(el);
      const { rank } = getRankingInfo(el);
      const record = {
        wins: Number($('.wins', el).first().text().trim()),
        ties: Number($('.ties', el).first().text().trim()),
        losses: Number($('.loss', el).first().text().trim()),
      };
      cut.set(id, { rank, record });
    });

  // Swiss data
  return $('.player .data')
    .toArray()
    .map(el => {
      const id = getPlayerId(el);
      const player = $('.player_link', el).first().text();

      const { rank: swiss, dropped } = getRankingInfo(el);
      const cutInfo = cut.get(id);

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
          elimination: cutInfo?.rank,
        },
        points,
        record: combineRecords(record, cutInfo?.record),
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
export const parseRounds = async (
  id: string,
  info: { swiss: number; cut: number }
) => {
  const rounds = await getEventRounds(id, info);

  return rounds.map(({ type, number, html }) => {
    const $ = load(html);
    const games = $('.game');

    /**
     * Get scenario from first game. We except the same
     * scenario is played in each game of the round.
     */
    const scenario = games
      .first()
      .find('.details:last-child')
      .find('.item')
      .children()
      .last()
      .text()
      .trim() as Scenarios;

    const matches = games.toArray().map(game => {
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
        player1points: score[0],
        player2: players[1] || '-',
        'player2-id': ids[1],
        player2points: score[1],
      };
    });

    return {
      'round-type': type,
      'round-number': number,
      matches,
      scenario,
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

// API
// ---------------
export const getEventInfo = async (id: string) => {
  const { url, html } = await getEventHtml(id);
  const $ = load(html);

  const title = parseTitle($);
  const { date, description } = parseDescription($);

  return { url, id, vendor: 'longshanks', title, date, description };
};

export const getEvent = async (id: string) => {
  const { url, html } = await getEventHtml(id);
  const $ = load(html);

  const title = parseTitle($);
  const players = await parsePlayerInfo(id);
  const squads = parseSquads($, players);
  const rounds = await parseRounds(id, getRoundsInfoFromHTML(html));

  return { id, url, title, squads, rounds };
};

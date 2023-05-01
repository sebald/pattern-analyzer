import { load, type Element } from 'cheerio';
import { PlayerData, PlayerRecord, SquadData, XWSData } from '../types';

// Fetch
// ---------------
const fetchEventHomepage = async (id: string) => {
  const url = `https://longshanks.org/events/detail/?event=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`[longshanks] Failed to fetch event data... (${id})`);
  }

  const html = await res.text();
  const $ = load(html);

  const name =
    $('head meta[property=og:title]').attr('content') || 'Unknown Event';
  const description =
    $('head meta[property=og:description]').attr('content') || '•';
  const [date] = description.split('•');

  return { name, date: date.trim() };
};

const fetchStandings = async (id: string, section: 'player' | 'player_cut') => {
  const res = await fetch(
    `https://longshanks.org/events/detail/panel_standings.php?event=${id}&section=${section}`
  );

  if (!res.ok) {
    throw new Error(
      `[longshanks] Failed to fetch standings... (${id}, ${section})`
    );
  }

  return await res.text();
};

const fetchSquad = async (eventId: string, playerId: string) => {
  const res = await fetch(`/api/longshanks/event/${eventId}/xws/${playerId}`);

  if (!res.ok) {
    throw new Error(
      `[longshanks] Failed to fetch player ${playerId} for event ${eventId}, got a ${res.status}...`
    );
  }

  const data = (await res.json()) as XWSData;
  return data;
};

// API
// ---------------
/**
 * Get some basic event information (name, date, ...)
 */
export const getEventInfo = async (eventId: string) => {
  const { name, date } = await fetchEventHomepage(eventId);

  return {
    name,
    date,
    url: `https://longshanks.org/events/detail/?event=${eventId}`,
    vendor: 'longshanks',
  };
};

/**
 * Get performance of all players, based on their swiss and cut standings.
 */
export const getPlayerData = async (eventId: string): Promise<PlayerData[]> => {
  // Fetch data from API
  const [playerHtml, cutHtml] = await Promise.all([
    fetchStandings(eventId, 'player'),
    fetchStandings(eventId, 'player_cut'),
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
 * Get squad (XWS, raw) for every player and merge informations.
 *
 * Since we have to fetch every squad individually this is a lazy method that
 * will return a fetcher that can be executed later.
 */
export const getSquadsData = (eventId: string, players: PlayerData[]) => {
  const requests = players.map(({ id, player, ...performance }) => {
    // Only return a fetch function instead of fetching immediately
    return async () => {
      const { url, xws, raw } = await fetchSquad(eventId, id);

      return {
        ...performance,
        id: eventId,
        url,
        xws,
        raw,
        player,
      } satisfies SquadData;
    };
  });

  return async () => Promise.all(requests.map(f => f()));
};

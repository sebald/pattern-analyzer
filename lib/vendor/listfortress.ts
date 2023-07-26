import type {
  ListfortressTournament,
  ListfortressTournamentInfo,
  SquadData,
} from '../types';
import { toXWS, getBuilderLink } from '../xws';

export const FORMAT_MAP = {
  standard: 36, // 2.5 Standard actually
  legacy: 37,
};

// Tournaments
// ---------------
export interface TournamentFilter {
  /**
   * Filter by tournament name (substring)
   */
  q?: string | null;
  /**
   * Filter by tournament type
   */
  format?: keyof typeof FORMAT_MAP | null;
  /**
   * Tournaments occured at or after given date.
   */
  from?: Date;
  /**
   * Tournaments occured at or before given date.
   */
  to?: Date;
}

export const getAllTournaments = async ({
  q,
  format,
  from,
  to,
}: TournamentFilter = {}) => {
  const api_url = 'https://listfortress.com/api/v1/tournaments/';
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error('[listfortress] Failed to fetch events...');
  }

  const tournaments: ListfortressTournamentInfo[] = await res.json();

  return tournaments.filter(t => {
    // Includes given name
    if (q && !t.name.toLocaleLowerCase().includes(q.toLocaleLowerCase())) {
      return false;
    }

    // Include only certain format
    if (format && FORMAT_MAP[format] !== t.format_id) {
      return false;
    }

    // Occured in given time frame
    const date = new Date(t.date);

    if (from && date < from) {
      return false;
    }

    if (to && date > to) {
      return false;
    }

    return true;
  });
};

export const getTournament = async (id: string) => {
  const api_url = `https://listfortress.com/api/v1/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[listfortress] Failed to fetch event data... (${id})`);
  }

  const tournament: ListfortressTournament = await res.json();
  return tournament;
};

// Squads
// ---------------
const updateRcord = (
  record: SquadData['record'] = {
    wins: 0,
    ties: 0,
    losses: 0,
  },
  player: number,
  opponent: number
) => {
  const field: keyof SquadData['record'] =
    player > opponent ? 'wins' : player < opponent ? 'losses' : 'ties';

  return {
    ...record,
    [field]: record[field] + 1,
  };
};

export const getSquads = async ({ id }: { id: string }) => {
  const { participants, rounds } = await getTournament(id);
  const records: { [playerId: string]: SquadData['record'] } = {};

  rounds.forEach(round => {
    round.matches.forEach(
      ({ player1_id, player1_points, player2_id, player2_points }) => {
        records[player1_id] = updateRcord(
          records[player1_id],
          player1_points,
          player2_points
        );

        // Buys don't have a second player
        if (player2_id !== undefined) {
          records[player2_id] = updateRcord(
            records[player2_id],
            player2_points,
            player1_points
          );
        }
      }
    );
  });

  let squads = participants.map(({ list_json, ...p }) => {
    let xws = null;
    try {
      if (list_json) {
        xws = toXWS(list_json || '');
      }
    } catch {
      console.log(`[listfortress] Failed to parse "list_json": ${list_json}`);
    }

    return {
      id: `${p.id}`,
      player: p.name,
      xws,
      raw: list_json || '',
      url: getBuilderLink(xws),
      rank: {
        swiss: p.swiss_rank,
        elimination: p.top_cut_rank,
      },
      points: p.score,
      record: records[p.id] || {
        wins: 0,
        losses: 0,
        ties: 0,
      },
      sos: Number(p.sos),
      missionPoints: p.mission_points,
      mov: p.mov,
      dropped: p.dropped,
    };
  }) satisfies SquadData[];

  /**
   * Failsafe: Some tournament software breaks listfortress tournaments.
   * E.g. https://listfortress.com/tournaments/3805
   */
  squads = squads.filter(({ xws }) => (xws ? xws.pilots.length : true));

  // Only filter if records were reported
  if (Object.keys(records).length) {
    /**
     * Rollbetter reports people from the waitlist as
     * participants. We remove them by checking some of
     * their stats.
     */
    squads = squads.filter(p => {
      const games = Object.values(p.record).reduce((acc, n) => n + acc, 0);
      return p.sos > 0 && games > 0;
    }) satisfies SquadData[];
  }

  squads.sort((a, b) => {
    if (a.rank.elimination || b.rank.elimination) {
      return (a.rank.elimination ?? 1000) - (b.rank.elimination ?? 1000);
    }
    return a.rank.swiss - b.rank.swiss;
  });

  return squads;
};

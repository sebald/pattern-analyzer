import { SquadData } from './types';
import { getBuilderLink } from './xws';
import { toXWS } from './xws';

// Types
// ---------------
export interface ListfortressTournament {
  id: number;
  name: string;
  location: string;
  state: string;
  country: string;
  date: string;
  format_id: number;
  version_id: any;
  tournament_type_id: number;
  created_at: string;
  updated_at: string;
  participants: ListfortressParticipant[];
  rounds: ListfortressRound[];
}

export interface ListfortressParticipant {
  id: number;
  name: string;
  tournament_id: number;
  score: number;
  swiss_rank: number;
  top_cut_rank?: number;
  mov: number;
  sos: string;
  dropped: any;
  list_points: any;
  list_json?: string;
  event_points: any;
  mission_points: any;
}

export interface ListfortressRound {
  id: number;
  tournament_id: number;
  roundtype_id: number;
  round_number: number;
  scenario: string;
  matches: ListfortressMatch[];
}

export interface ListfortressMatch {
  id: number;
  player1_id: number;
  player1_points: number;
  player2_id?: number;
  player2_points: number;
  result: any;
  winner_id?: number;
  rounds_played: any;
  went_to_time: any;
}

// Fetch
// ---------------
const getTournament = async (id: string) => {
  const api_url = `https://listfortress.com/api/v1/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[listfortress] Failed to fetch event data... (${id})`);
  }

  const tournament: ListfortressTournament = await res.json();
  return tournament;
};

// Helpers
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

const parseSquads = (
  participants: ListfortressParticipant[],
  rounds: ListfortressRound[]
): SquadData[] => {
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

  return (
    participants
      .map(({ list_json, ...p }) => {
        let xws = null;
        try {
          if (list_json) {
            xws = toXWS(list_json || '');
          }
        } catch {
          console.log(
            `[listfortress] Failed to parse "list_json": ${list_json}`
          );
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
      })
      /**
       * Rollbetter reports people from the waitlist as
       * participants. We remove them by checking some of
       * their stats.
       */
      .filter(p => {
        const games = Object.values(p.record).reduce((acc, n) => n + acc, 0);
        return p.sos > 0 && games > 0;
      })
  );
};

// API
// ---------------
export const getEvent = async (id: string) => {
  const { name, participants, rounds } = await getTournament(id);
  const squads = parseSquads(participants, rounds);
  /**
   * Note that we are not including round infos since
   * its only used in the listfortress export.
   */
  return {
    id,
    url: `https://listfortress.com/tournaments/${id}`,
    title: name,
    squads,
    rounds: [],
  };
};

export const getEventInfo = async (id: string) => {
  const { name, date } = await getTournament(id);

  return {
    url: `https://listfortress.com/tournaments/${id}`,
    id,
    vendor: 'listfortress',
    title: name,
    date,
    description: '',
  };
};

import type { PlayerData, SquadData, XWSSquad } from './types';
import { round } from './utils';
import { normalize } from './xws';
import { yasb2xws } from './yasb';

export interface RollBetterTournamentResponse {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  timezone: string;
  description: string;
  registrationCount: number;
  // there is more but this is all we need for now
}

export interface RollBetterPlayersResponse {
  id: number;
  hasDropped: boolean;
  player: {
    id: number;
    username: string;
    affiliation?: string;
  };
  ranking: {
    id: number;
    points1: number; // Event Points
    points2: number; // Mission Points
    points3: number; // MOV
    mov: number;
    sos: number;
    wins: number;
    losses: number;
    draws: number;
    seed?: number;
    isChampion: boolean;
  };
}

export interface RollBetterListResponse {
  registrations: Registration[];
  count: number;
}

export interface Registration {
  id: number;
  withList?: string;
  withAlternateList: any;
  isWaitlisted: boolean;
  player: {
    username: string;
  };
  listSummary?: {
    id: number;
    faction: string;
    units: string[];
  };
}

/**
 * Check if players performance is absolutely the same.
 * Their points and all their tie breakers are equal.
 */
const tied = (player1: PlayerData, player2: PlayerData) =>
  player1.points === player2.points &&
  player1.sos === player2.sos &&
  player1.missionPoints === player2.missionPoints &&
  player1.mov === player2.mov;

const getLists = async (id: string, count: number) => {
  // rollbetter's max page count seems to be 25
  const pageSize = 25;
  const pagination = [];

  let current = 0;
  while (current < count) {
    pagination.push(current);
    current = current + pageSize;
  }

  const responses = await Promise.all(
    pagination.map(skip =>
      fetch(
        `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/lists?skip=${skip}&take=25`
      )
    )
  );

  let data: RollBetterListResponse[] = [];

  data = await Promise.all<RollBetterListResponse>(
    responses.map(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch lists from rollbetter...');
      }

      return res.json();
    })
  ).catch(() => {
    /**
     * This handles a werid rollbetter API where hidden lists returns an empty 200.
     */
    return [];
  });

  return data.map(({ registrations }) => registrations).flat();
};

export const getPlayers = async (id: string) => {
  const res = await fetch(
    `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/players`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch player data... (${id})`);
  }

  let players: PlayerData[] = [];

  const data: RollBetterPlayersResponse[] = await res.json();

  data.forEach(({ id, player, ranking }) => {
    players.push({
      id: `${id}`,
      player: player.username,
      rank: ranking.seed || 1000, // not included in data :(
      points: ranking.points1,
      record: {
        wins: ranking.wins,
        ties: ranking.draws,
        losses: ranking.losses,
      },
      sos: round(ranking.sos, 2),
      missionPoints: ranking.points2,
      mov: ranking.points3,
    });
  });

  // Do sorting and ranking is missing from the API :-(
  players.sort((a, b) => {
    /**
     * If one of the players already has a rank (vis seed)
     * that is different from our arbitrary value (1000) we
     * can do the ranking.
     */
    if (a.rank < 1000 || b.rank < 1000) {
      return a.rank - b.rank;
    }

    // Different points -> use this
    if (a.points !== b.points) {
      return b.points - a.points;
    }

    // 1. Tiebreaker: SOS
    if (a.sos !== b.sos) {
      return b.sos - a.sos;
    }

    // 2. Tiebreaker: Mission Points
    if (a.missionPoints !== b.missionPoints) {
      return b.missionPoints - a.missionPoints;
    }

    // 3. Tiebreaker: MOV
    if (a.mov !== b.mov) {
      return b.mov - a.mov;
    }

    // Let's hope we don't end up here :D
    return 0;
  });

  let rank = 1;
  return players.map((player, idx) => {
    if (player.rank < 1000) {
      rank = rank + 1;
      return player;
    }

    /**
     * Players are tied (same performance)
     * -> rank is same as previous player.
     */
    // @ts-expect-error
    const prevPlayer = player[idx - 1];
    if (prevPlayer && tied(player, prevPlayer)) {
      return {
        ...player,
        rank,
      };
    }

    const p = {
      ...player,
      rank,
    };
    rank = rank + 1;

    return p;
  });
};

export const getSquads = async (id: string, players: PlayerData[]) => {
  const data = await getLists(id, players.length);
  const squads: SquadData[] = [];

  data.forEach(({ id: playerId, withList, player: { username } }) => {
    const id = `${playerId}`;
    let xws: XWSSquad | null = null;
    let url: string | null = null;

    try {
      if (withList) {
        // Check if given as JSON
        if (withList.startsWith('{')) {
          xws = normalize(JSON.parse(withList));
        }
        // Check if given as YASB Url
        if (withList.trim().startsWith('https://yasb.app')) {
          xws = yasb2xws(withList);
        }

        url =
          xws?.vendor?.yasb?.link ||
          xws?.vendor?.lbn?.link.replace('print', '') ||
          null;
      }
    } catch {
      console.log(
        `Failed to parse squad of "${username}" (${id}).\nOriginal value is: :${withList}`
      );
    }

    const performance = players.find(player => player.id === id) || {
      rank: 0,
      points: 0,
      record: { wins: 0, ties: 0, losses: 0 },
      sos: 0,
      missionPoints: 0,
      mov: 0,
    };

    squads.push({
      id,
      player: username,
      url,
      xws,
      raw: withList || '',
      ...performance,
    });
  });

  return squads;
};

export const getEventInfo = async (id: string) => {
  const api_url = `https://rollbetter-linux.azurewebsites.net/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`Failed to fetch event data... (${id})`);
  }

  const {
    title,
    description,
    startDate,
    endDate,
  }: RollBetterTournamentResponse = await res.json();

  const date = startDate + (endDate ? ` ${endDate}` : '');

  return {
    url: `https://rollbetter.gg/tournaments/${id}`,
    id,
    vendor: 'rollbetter',
    title,
    date,
    description,
  };
};

export const getEvent = async (id: string) => {
  const [{ url, title }, players] = await Promise.all([
    getEventInfo(id),
    getPlayers(id),
  ]);
  const squads = await getSquads(id, players);

  return { id, url, title, squads };
};

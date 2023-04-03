import type { PlayerData, SquadData, XWSSquad } from './types';
import { round } from './utils';
import { getBuilderLink, toXWS } from './xws';
import { xwsFromText, yasb2xws } from './yasb';

export interface RollBetterTournamentResponse {
  id: number;
  title: string;
  startDate: string;
  endDate: string | null;
  timezone: string;
  description: string;
  registrationCount: number;
  rounds: {
    id: number;
    roundNumber: number;
    cutSize: number | null;
    startState: string;
    startTime: any;
    endTime: any;
    startDate: any;
    endDate: any;
    type: 'Swiss' | 'Graduated Cut';
  }[];
  // there is more but this is all we need for now
}

export interface RollBetterPlayersResponse {
  id: number;
  hasDropped: boolean;
  isWaitlisted: boolean;
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

const getRegistration = async (id: string, count: number) => {
  // rollbetter's max page count seems to be 25
  const pageSize = 20;
  const pagination = [];

  let current = 0;
  while (current < count) {
    pagination.push(current);
    current = current + pageSize;
  }

  const responses = await Promise.all(
    pagination.map(skip =>
      fetch(
        `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/lists?skip=${skip}&take=${pageSize}&query=`
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

  data.forEach(({ id, player, ranking, hasDropped, isWaitlisted }) => {
    if (isWaitlisted) {
      return;
    }

    players.push({
      id: `${id}`,
      player: player.username,
      rank: {
        swiss: 1000, // not included in data :(
        elimination: ranking.seed ?? undefined,
      },
      points: ranking.points1,
      record: {
        wins: ranking.wins,
        ties: ranking.draws,
        losses: ranking.losses,
      },
      sos: round(ranking.sos, 2),
      missionPoints: ranking.points2,
      mov: ranking.points3,
      dropped: hasDropped,
    });
  });

  // Do sorting, ranking is missing from the API :-(
  players.sort((a, b) => {
    // Using the elimniation if possible
    if (a.rank.elimination || b.rank.elimination) {
      return (a.rank.elimination ?? 1000) - (b.rank.elimination ?? 1000);
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

  // Calculate swiss ranking
  let swiss = 1;
  return players.map((player, idx) => {
    /**
     * Players are tied (same performance)
     * -> rank is same as previous player.
     */
    // @ts-expect-error (TS doesn't get that we chack if there could be a prev player at all)
    const prevPlayer = player[idx - 1];
    if (prevPlayer && tied(player, prevPlayer)) {
      return {
        ...player,
        rank: {
          ...player.rank,
          swiss,
        },
      };
    }

    const p = {
      ...player,
      rank: {
        ...player.rank,
        swiss,
      },
    };
    swiss = swiss + 1;

    return p;
  });
};

export const getSquads = async (
  id: string,
  players: PlayerData[]
): Promise<SquadData[]> => {
  const registrations = await getRegistration(id, players.length);

  return players.map(player => {
    const registraion = registrations.find(r => r && player.id === `${r.id}`);

    let xws: XWSSquad | null = null;
    let url: string | null = null;

    if (!registraion) {
      return {
        ...player,
        url,
        xws,
        raw: '',
      };
    }

    const {
      id,
      withList,
      player: { username },
    } = registraion;

    try {
      if (withList) {
        // Check if given as JSON
        if (withList.startsWith('{')) {
          xws = toXWS(withList);
        }
        // Check if given as YASB Url
        if (withList.trim().startsWith('https://yasb.app')) {
          xws = yasb2xws(withList);
        }
        // Still nothin? Maybe there is a YASB link?
        if (!xws) {
          xws = xwsFromText(withList).xws;
        }

        url = getBuilderLink(xws);
      }
    } catch {
      console.log(
        `Failed to parse squad of "${username}" (${id}).\nOriginal value is: :${withList}`
      );
    }

    return {
      ...player,
      url,
      xws,
      raw: withList || '',
    };
  });
};

export const getEventInfo = async (id: string) => {
  const api_url = `https://rollbetter-linux.azurewebsites.net/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[rollbetter] Failed to fetch event data... (${id})`);
  }

  const {
    title,
    description,
    startDate,
    endDate,
  }: RollBetterTournamentResponse = await res.json();

  const date = startDate + (endDate ? ` to ${endDate}` : '');

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

  /**
   * Note that we are not supporting round infos rollbetter
   * yet. Since we only use the data for listfortress exports
   * for now, we don't gather it.
   */
  return { id, url, title, squads, rounds: [] };
};

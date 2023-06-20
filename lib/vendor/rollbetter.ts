import { PlayerData, XWSSquad } from '@/lib/types';
import { round } from '@/lib/utils/math.utils';
import { getBuilderLink, toXWS } from '@/lib/xws';
import { xwsFromText, yasb2xws } from '@/lib/yasb';

// Types
// ---------------
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
  ladder: Ladder[];
  waitlist: any[];
}

export interface Ladder {
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
    extSos: number;
    averageMov: number;
    extAverageMov: number;
    wins: number;
    losses: number;
    draws: number;
    seed?: number;
    invalidMovRounds: number;
    nonElimRounds: number;
    isChampion: boolean;
    byesReceived: number;
    elimPlacement: any;
  };
  listSummary?: {
    id: number;
    faction: string;
    units: string[];
    format?: string;
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

// Helpers
// ---------------
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
        throw new Error('[rollbetter] Failed to fetch lists...');
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

// API
// ---------------
const getTournament = async (id: string) => {
  const api_url = `https://rollbetter-linux.azurewebsites.net/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[rollbetter] Failed to fetch event data... (${id})`);
  }

  const { title, startDate }: RollBetterTournamentResponse = await res.json();

  return { name: title, date: startDate };
};

// API
// ---------------
export const getEventInfo = async (id: string) => {
  const { name, date } = await getTournament(id);

  return {
    name,
    date,
    url: `https://rollbetter.gg/tournaments/${id}`,
    vendor: 'rollbetter',
  };
};

export const getPlayerData = async (id: string) => {
  const res = await fetch(
    `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/players`
  );

  if (!res.ok) {
    throw new Error(`[rollbetter] Failed to fetch player data... (${id})`);
  }

  let players: PlayerData[] = [];
  const data: RollBetterPlayersResponse = await res.json();

  data.ladder.forEach(
    ({ id, player, ranking, hasDropped, isWaitlisted }, idx) => {
      if (isWaitlisted) {
        return;
      }

      players.push({
        id: `${id}`,
        player: player.username,
        // end result = ladder sorting, players in the cut have a seed
        rank: {
          swiss: ranking.seed || idx + 1,
          elimination: ranking.seed ? idx + 1 : undefined,
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
    }
  );

  console.log(players);

  return players;
};

export const getSquadsData = async (id: string, players: PlayerData[]) => {
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
        `[rollbetter] Failed to parse squad of "${username}" (${id}).\nOriginal value is: :${withList}`
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

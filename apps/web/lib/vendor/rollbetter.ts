import type { XWSSquad } from '@pattern-analyzer/xws/types';
import { toXWS, getBuilderLink } from '@pattern-analyzer/xws/xws';
import { yasb2xws, xwsFromText } from '@pattern-analyzer/xws/yasb';
import type { EventInfo, PlayerData, SquadData } from '../types';
import { round } from '../utils/math.utils';

// Types
// ---------------
interface RollBetterTournament {
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
}

interface RollBetterLists {
  registrations: RollBetterRegistration[];
  count: number;
}

interface RollBetterRegistration {
  id: number;
  lists: {
    id: number;
    name: string;
    faction?: string;
    format?: string;
    raw: string;
    priority: number;
  }[];
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

interface RollBetterPlayers {
  ladder: RollBetterLadder[];
  waitlist: any[];
}

interface RollBetterLadder {
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

// Internal helpers
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
        `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/lists?skip=${skip}&take=${pageSize}&query=`,
        { next: { revalidate: 300 } }
      )
    )
  );

  let data: RollBetterLists[] = [];

  data = await Promise.all<RollBetterLists>(
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

const getPlayerData = async (id: string) => {
  const res = await fetch(
    `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/players`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error(`[rollbetter] Failed to fetch player data... (${id})`);
  }

  let players: PlayerData[] = [];
  const data: RollBetterPlayers = await res.json();

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

  return players;
};

const getSquadsData = async (id: string, players: PlayerData[]) => {
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
      lists,
      player: { username },
    } = registraion;

    /**
     * Rollbetter can store more than one lists per player, we don't support this yet.
     * Just take the first one.
     */
    const list = lists[0] || { raw: '' };

    try {
      if (list.raw) {
        // Check if given as JSON
        if (list.raw.startsWith('{')) {
          xws = toXWS(list.raw);
        }
        // Check if given as YASB Url
        if (list.raw.trim().startsWith('https://yasb.app')) {
          xws = yasb2xws(list.raw);
        }
        // Still nothin? Maybe there is a YASB link?
        if (!xws) {
          xws = xwsFromText(list.raw).xws;
        }

        url = getBuilderLink(xws);
      }
    } catch {
      console.log(
        `[rollbetter] Failed to parse squad of "${username}" (${id}).\nOriginal value is: :${list.raw}`
      );
    }

    return {
      ...player,
      url,
      xws,
      raw: list.raw || '',
    };
  });
};

// Exported functions
// ---------------
export const getEventInfo = async (id: string): Promise<EventInfo> => {
  const api_url = `https://rollbetter-linux.azurewebsites.net/tournaments/${id}`;
  const res = await fetch(api_url, { next: { revalidate: 86_400 } });

  if (!res.ok) {
    throw new Error(`[rollbetter] Failed to fetch event data... (${id})`);
  }

  const { title, startDate }: RollBetterTournament = await res.json();

  return {
    id,
    name: title,
    date: startDate,
    url: `https://rollbetter.gg/tournaments/${id}`,
    vendor: 'rollbetter',
  };
};

export const getSquads = async ({
  id,
}: {
  id: string;
}): Promise<SquadData[]> => {
  const players = await getPlayerData(id);
  const squads = await getSquadsData(id, players);
  return squads;
};

export const getExportData = async (id: string): Promise<unknown> => {
  const res = await fetch(
    `https://rollbetter-linux.azurewebsites.net/tournaments/${id}/list-fortress-json`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(
      `[rollbetter] Failed to fetch export data... (${id})`
    );
  }

  return res.json();
};

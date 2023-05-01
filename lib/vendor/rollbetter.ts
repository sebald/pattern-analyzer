import { PlayerData } from '../types';

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
    url: `https://listfortress.com/tournaments/${id}`,
    vendor: 'listfortress',
  };
};

export const getPlayerData = async (id: string) => {
  return [];
};

export const getSquadsData = async (id: string, players: PlayerData[]) => {
  return [];
};

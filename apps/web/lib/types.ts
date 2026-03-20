import type { XWSSquad } from '@pattern-analyzer/xws/types';

export type Vendor = 'rollbetter' | 'listfortress';

// Data
// ---------------
export interface Ship {
  id: string;
  name: string;
  icon: string;
  pilots: { [name: string]: Pilot };
}

export interface Pilot {
  id: string;
  name: string;
  caption?: string;
}

export interface Upgrade {
  id: string;
  name: string;
}

export interface GameRecord {
  wins: number;
  ties: number;
  losses: number;
}

export interface PlayerData {
  id: string;
  player: string;
  rank: {
    swiss: number;
    elimination?: number;
  };
  points: number;
  record: GameRecord;
  sos: number;
  missionPoints: number;
  mov: number;
  dropped?: boolean;
}

export interface XWSData {
  id: string;
  url: string | null;
  xws: XWSSquad | null;
  raw: string;
}

export interface SquadData extends XWSData, PlayerData {}

export interface EventInfo {
  id: string;
  name: string;
  date: string;
  url: string;
  vendor: string;
}

export interface EventData {
  id: string[];
  title: string;
  vendor: Vendor;
  urls: { href: string; text: string }[];
  squads: SquadData[];
  rounds: ListfortressRound[];
}

// List Fortress
// ---------------
export type Scenarios =
  | 'Assault at the Satellite Array'
  | 'Chance Engagement'
  | 'Scramble the Transmissions'
  | 'Salvage Mission';

// https://github.com/AlexRaubach/ListFortress/issues/63#issuecomment-1376711528
export interface ListfortressExport {
  players: ListfortressPlayer[];
  rounds: ListfortressRound[];
}

export interface ListfortressPlayer {
  id: string;
  name: string;
  score: number;
  sos: number;
  mov: number;
  rank: {
    swiss: number;
    elimination?: number;
  };
  dropped?: boolean;
  list?: string | XWSSquad;
}

export interface ListfortressRound {
  'round-type': 'swiss' | 'elimination';
  'round-number': number;
  matches: {
    player1: string;
    'player1-id': string;
    player1points: number;
    player2: string;
    'player2-id': string;
    player2points: number;
    'winner-id'?: string;
    winner?: string;
  }[];
  scenario: Scenarios;
}

export interface ListfortressTournamentInfo {
  id: number;
  name: string;
  location: string;
  state: string;
  country: string;
  date: string;
  format_id: number;
  version_id: unknown;
  tournament_type_id: number;
  created_at: string;
  updated_at: string;
}

export interface ListfortressTournament {
  id: number;
  name: string;
  location: string;
  state: string;
  country: string;
  date: string;
  format_id: number;
  version_id: unknown;
  tournament_type_id: number;
  created_at: string;
  updated_at: string;
  participants: ListfortressParticipant[];
  rounds: {
    id: number;
    tournament_id: number;
    roundtype_id: number;
    round_number: number;
    scenario: string;
    matches: {
      id: number;
      player1_id: number;
      player1_points: number;
      player2_id?: number;
      player2_points: number;
      result: string;
      winner_id?: number;
      rounds_played: unknown;
      went_to_time: unknown;
    }[];
  }[];
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
  dropped: unknown;
  list_points: unknown;
  list_json?: string;
  event_points: unknown;
  mission_points: unknown;
}

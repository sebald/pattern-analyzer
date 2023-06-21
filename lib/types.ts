import type { Ships } from './get-value';

export type Vendor = 'longshanks' | 'rollbetter' | 'listfortress';

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

export interface PlayerRecord {
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
  record: PlayerRecord;
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
  rounds: ListFortressRound[];
}

// XWS
// ---------------
export type XWSFaction =
  | 'rebelalliance'
  | 'galacticempire'
  | 'scumandvillainy'
  | 'resistance'
  | 'firstorder'
  | 'galacticrepublic'
  | 'separatistalliance';

export interface XWSSquad {
  faction: XWSFaction;
  pilots: XWSPilot[];
  points: number;
  vendor: {
    yasb?: XWSVendor;
    lbn?: XWSVendor;
  };
  version: string;
  name: string;
}

export interface XWSPilot {
  id: string;
  ship: Ships;
  points: number;
  upgrades: XWSUpgrades;
}

export type XWSUpgradeSlots =
  | 'astromech'
  | 'cannon'
  | 'cargo'
  | 'command'
  | 'configuration'
  | 'crew'
  | 'device'
  | 'force-power'
  | 'gunner'
  | 'hardpoint'
  | 'hyperdrive'
  | 'illicit'
  | 'missile'
  | 'modification'
  | 'sensor'
  | 'tactical-relay'
  | 'talent'
  | 'team'
  | 'tech'
  | 'title'
  | 'torpedo'
  | 'turret';

export type XWSUpgrades = { [Slot in XWSUpgradeSlots]?: string[] };

export interface XWSVendor {
  builder: string;
  builder_url: string;
  link: string;
  version: string;
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
  players: ListFortressPlayer[];
  rounds: ListFortressRound[];
}

export interface ListFortressPlayer {
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

export interface ListFortressRound {
  'round-type': 'swiss' | 'elimination';
  'round-number': number;
  matches: {
    player1: string;
    'player1-id': string;
    player2: string;
    'player2-id': string;
    player1points: number;
    player2points: number;
    'winner-id'?: string;
    winner?: string;
  }[];
  scenario: Scenarios;
}

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

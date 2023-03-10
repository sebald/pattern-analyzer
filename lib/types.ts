import type { Ships } from './get-value';

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

export interface PlayerData {
  id: string;
  player: string;
  rank: {
    swiss: number;
    elimination?: number;
  };
  points: number;
  record: { wins: number; ties: number; losses: number };
  sos: number;
  missionPoints: number;
  mov: number;
  dropped?: boolean;
}

export interface SquadData extends PlayerData {
  id: string;
  url: string | null;
  xws: XWSSquad | null;
  raw: string;
  player: string;
}

export interface EventData {
  id: string[];
  title: string;
  vendor: 'longshanks' | 'rollbetter';
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
    player1Points: number;
    player2Points: number;
    'winner-id'?: string;
  }[];
  scenario: Scenarios;
}

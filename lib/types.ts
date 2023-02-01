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

export interface SquadData {
  id: string;
  url: string | null;
  xws: XWSSquad | null;
  raw: string;
  player: string;
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

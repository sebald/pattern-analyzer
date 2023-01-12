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
  vendor: XWSVendor;
  version: string;
  name: string;
}

export interface XWSPilot {
  id: string;
  ship: string;
  points: number;
  upgrades: XWSUpgrades;
}

export interface XWSUpgrades {
  astromech?: string[];
  cannon?: string[];
  cargo?: string[];
  command?: string[];
  configuration?: string[];
  crew?: string[];
  device?: string[];
  'force-power'?: string[];
  gunner?: string[];
  hardpoint?: string[];
  hyperdrive?: string[];
  illicit?: string[];
  missile?: string[];
  modification?: string[];
  sensor?: string[];
  'tactical-relay'?: string[];
  talent?: string[];
  team?: string[];
  tech?: string[];
  title?: string[];
  torpedo?: string[];
  turret?: string[];
}

export interface XWSVendor {
  builder?: string;
  builder_url?: string;
  url?: string;
}

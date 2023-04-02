import type { Ships } from '@/lib/get-value';
import type { XWSFaction, XWSUpgradeSlots } from '@/lib/types';

export type FactionMap<Key extends string, Value> = {
  [faction in XWSFaction]: { [key in Key]?: Value };
};

export type FactionMapWithAll<Key extends string, Value> = {
  [faction in XWSFaction | 'all']: { [key in Key]?: Value };
};

export interface FactionStatData {
  count: number;
  records: { wins: number; ties: number; losses: number }[];
  ranks: number[];
  percentile: number;
  deviation: number;
  winrate: number;
}

export interface PilotStatData {
  ship: Ships;
  count: number;
  lists: number;
  records: { wins: number; ties: number; losses: number }[];
  ranks: number[];
  frequency: number;
  percentile: number;
  deviation: number;
  winrate: number;
}

export interface ShipStatData {
  frequency: number;
  count: number;
  lists: number;
}

export interface UpgradeData {
  slot: XWSUpgradeSlots;
  count: number;
  lists: number;
  records: { wins: number; ties: number; losses: number }[];
  ranks: number[];
  frequency: number;
  percentile: number;
  deviation: number;
  winrate: number;
}

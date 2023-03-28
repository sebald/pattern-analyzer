import type { Ships } from '@/lib/get-value';
import type { XWSFaction, XWSUpgradeSlots } from '@/lib/types';

// Types
// ---------------
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

// Faction Values
// ---------------
export const FACTION_COLORS: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: '#fca5a5',
  galacticempire: '#93c5fd',
  scumandvillainy: '#fcd34d',
  resistance: '#fb923c',
  firstorder: '#f87171',
  galacticrepublic: '#fbcfe8',
  separatistalliance: '#a5b4fc',
  unknown: '#cbd5e1',
};

export const FACTION_ABBR: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: 'REB',
  galacticempire: 'EMP',
  scumandvillainy: 'SCUM',
  resistance: 'RES',
  firstorder: 'FO',
  galacticrepublic: 'GAR',
  separatistalliance: 'CIS',
  unknown: '???',
};

export const COLOR_MAP = {
  3: '#e5ecfa',
  4: '#d0dcf5',
  5: '#b4c5ed',
  6: '#96a6e3',
  7: '#8490db',
  8: '#6167ca',
};

// Helpers
// ---------------
export const toPercentage = (value: number) =>
  new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

export const calcWeightedAverage = (
  map: { [key: number]: number },
  total: number
) =>
  Object.entries(map).reduce((mean, [size, count]) => {
    mean = mean + Number(size) * count;
    return mean;
  }, 0) / total;

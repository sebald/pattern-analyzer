import type { Ships } from '@/lib/get-value';
import type { XWSFaction, XWSUpgradeSlots } from '@/lib/types';

// Types
// ---------------
export type FactionMap<Key extends string, Value> = {
  [faction in XWSFaction]: { [key in Key]?: Value };
};

export type FactionMapWithUnknwon<Key extends string, Value> = {
  [faction in XWSFaction | 'unknown']: { [key in Key]?: Value };
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

export interface UpgradeStatData {
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

export interface EventStats {
  tournamentStats: {
    xws: number;
    count: number;
    cut: number;
  };
  factionStats: { [Faction in XWSFaction | 'unknown']: FactionStatData };
}

// Data
// ---------------
const initFactionData = (): FactionStatData => ({
  count: 0,
  records: [],
  ranks: [],
  percentile: 0,
  deviation: 0,
  winrate: 0,
});

/**
 * Setup event stats data schema
 */
export const init = (): EventStats => ({
  tournamentStats: {
    xws: 0,
    count: 0,
    cut: 0,
  },
  factionStats: {
    rebelalliance: initFactionData(),
    galacticempire: initFactionData(),
    scumandvillainy: initFactionData(),
    resistance: initFactionData(),
    firstorder: initFactionData(),
    galacticrepublic: initFactionData(),
    separatistalliance: initFactionData(),
    unknown: initFactionData(),
  },
  squadSizes: {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  },
  pilotSkillDistribution: {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
  pilotStats: {
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  },
  pilotCostDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  },
  shipComposition: new Map<string, number>(),
  shipStats: {
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  },
  upgradeStats: {
    all: {},
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  },
});

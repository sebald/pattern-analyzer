import { Ships } from '../get-value';
import { PlayerRecord, XWSFaction, XWSUpgradeSlots } from '../types';

// Types
// ---------------
export type FactionMap<Key extends string, Value> = {
  [faction in XWSFaction]: { [key in Key]?: Value };
};

export type FactionMapWithAll<Key extends string, Value> = {
  [faction in XWSFaction | 'all']: { [key in Key]?: Value };
};

export interface FactionDataCollection {
  count: number;
  records: PlayerRecord[];
  ranks: number[];
}

export interface FactionDataCollection {
  count: number;
  records: { wins: number; ties: number; losses: number }[];
  ranks: number[];
}

export interface PilotDataCollection {
  ship: Ships;
  count: number;
  lists: number;
  records: { wins: number; ties: number; losses: number }[];
  ranks: number[];
}

export interface ShipDataCollection {
  count: number;
  lists: number;
}

export interface UpgradeDataCollection {
  slot: XWSUpgradeSlots;
  count: number;
  lists: number;
  records: { wins: number; ties: number; losses: number }[];
  ranks: number[];
}

export type SuqadDataCollection = ReturnType<typeof init>;

// Utils
// ---------------
const initFactionData = (): FactionDataCollection => ({
  count: 0,
  records: [],
  ranks: [],
});

/**
 * Initialiaze object that holds data collected from an event.
 */
export const init = () => {
  // Basic tournament data
  const tournament = {
    xws: 0,
    count: 0,
    cut: 0,
  };

  // Stats about factions (ranks, number of squads, ...)
  const faction: {
    [Faction in XWSFaction | 'unknown']: FactionDataCollection;
  } = {
    rebelalliance: initFactionData(),
    galacticempire: initFactionData(),
    scumandvillainy: initFactionData(),
    resistance: initFactionData(),
    firstorder: initFactionData(),
    galacticrepublic: initFactionData(),
    separatistalliance: initFactionData(),
    unknown: initFactionData(),
  };

  // Number of ships per squads
  const squadSizes = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  // Stats about pilots (performance, percentile, number of occurances)
  const pilot: FactionMap<string, PilotDataCollection> = {
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  };

  // Number of pilots per cost
  const pilotCostDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  // Initiative distribution
  const pilotSkillDistribution = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  // Ship stats
  const ship: FactionMap<Ships, ShipDataCollection> = {
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  };

  // Number of squads with the same ships (key = ship ids separated by "|")
  const shipComposition = new Map<string, number>();

  // Upgrades stats
  const upgrade: FactionMapWithAll<string, UpgradeDataCollection> = {
    all: {},
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  };

  return {
    tournament,
    faction,
    squadSizes,
    pilot,
    pilotCostDistribution,
    pilotSkillDistribution,
    ship,
    shipComposition,
    upgrade,
  };
};

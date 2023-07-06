import type { Ships } from '@/lib/get-value';
import type {
  XWSFaction,
  GameRecord,
  XWSUpgradeSlots,
  XWSSquad,
} from '@/lib/types';

// Maps
// ---------------
export type FactionMap<Key extends string, Value> = {
  [faction in XWSFaction]: { [key in Key]?: Value };
};

export type FactionMapWithAll<Key extends string, Value> = {
  [faction in XWSFaction | 'all']: { [key in Key]?: Value };
};

// Collection
// ---------------
export interface CommonDataCollection {
  count: number;
  records: GameRecord[];
  ranks: number[];
}

export interface PilotDataCollection {
  ship: Ships;
  count: number;
  lists: number;
  records: GameRecord[];
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
  records: GameRecord[];
  ranks: number[];
}

export interface CompositionDataCollection {
  ships: Ships[];
  xws: XWSSquad[];
  record: GameRecord;
  ranks: number[];
}

export interface SquadDataCollection {
  tournament: {
    xws: number;
    count: number;
    cut: number;
  };
  faction: {
    [Faction in XWSFaction | 'unknown']: CommonDataCollection;
  };
  squadSizes: {
    [Size in 3 | 4 | 5 | 6 | 7 | 8]: number;
  };
  pilot: FactionMap<string, PilotDataCollection>;
  pilotCostDistribution: {
    [Size in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9]: number;
  };
  pilotSkillDistribution: {
    [Size in 0 | 1 | 2 | 3 | 4 | 5 | 6]: number;
  };
  ship: FactionMap<Ships, ShipDataCollection>;
  shipComposition: Map<string, number>;
  upgrade: FactionMapWithAll<string, UpgradeDataCollection>;
  composition: { [id: string]: CompositionDataCollection };
}

// Stats
// ---------------
export interface PerformanceStats {
  percentile: number;
  deviation: number;
  winrate: number;
}

export interface FrequencyStats {
  frequency: number;
}

export interface FactionStats extends CommonDataCollection, PerformanceStats {}

export interface PilotStats
  extends PilotDataCollection,
    PerformanceStats,
    FrequencyStats {}

export interface ShipStats extends ShipDataCollection, FrequencyStats {}

export interface UpgradeStats
  extends UpgradeDataCollection,
    PerformanceStats,
    FrequencyStats {}

export interface CompositionStats
  extends CompositionDataCollection,
    PerformanceStats {}

export interface SquadStats {
  tournament: {
    /**
     * Number of tournaments
     */
    total: number;
    xws: number;
    /**
     * Number of squads
     */
    count: number;
    cut: number;
  };
  faction: {
    [Faction in XWSFaction | 'unknown']: FactionStats;
  };
  squadSizes: {
    [Size in 3 | 4 | 5 | 6 | 7 | 8]: number;
  };
  pilot: FactionMap<string, PilotStats>;
  pilotCostDistribution: {
    [Size in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9]: number;
  };
  pilotSkillDistribution: {
    [Size in 0 | 1 | 2 | 3 | 4 | 5 | 6]: number;
  };
  ship: FactionMap<Ships, ShipStats>;
  shipComposition: Map<string, number>;
  upgrade: FactionMapWithAll<string, UpgradeStats>;
  composition: { [id: string]: CompositionStats };
}

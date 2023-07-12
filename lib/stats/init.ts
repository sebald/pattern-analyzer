import type { Ships } from '../get-value';
import type { XWSFaction, XWSUpgradeSlots } from '../types';
import type {
  CommonDataCollection,
  CompositionStats,
  FactionMap,
  FactionMapWithAll,
  FrequencyStats,
  ScoreStats,
  PerformanceStats,
  PilotDataCollection,
  PilotStats,
  ShipDataCollection,
  ShipStats,
  SquadDataCollection,
  SquadStats,
  UpgradeDataCollection,
  UpgradeStats,
} from './types';

export const initFactionMap = <Key extends string, Value>(): FactionMap<
  Key,
  Value
> => ({
  rebelalliance: {},
  galacticempire: {},
  scumandvillainy: {},
  resistance: {},
  firstorder: {},
  galacticrepublic: {},
  separatistalliance: {},
});

export const initCommonData = (): CommonDataCollection => ({
  count: 0,
  records: [],
  ranks: [],
});

const initPerformance = (): PerformanceStats => ({
  percentile: 0,
  deviation: 0,
  winrate: 0,
});

const initFrequency = (): FrequencyStats => ({
  frequency: 0,
});

const initScore = (): ScoreStats => ({
  score: 0,
});

export const initPilotStats = (ship: Ships): PilotStats => ({
  ship,
  lists: 0,
  ...initCommonData(),
  ...initPerformance(),
  ...initFrequency(),
  ...initScore(),
});

export const initShipSats = (): ShipStats => ({
  count: 0,
  lists: 0,
  frequency: 0,
});

export const initUpgradeStats = (slot: XWSUpgradeSlots): UpgradeStats => ({
  slot,
  lists: 0,
  ...initCommonData(),
  ...initPerformance(),
  ...initFrequency(),
  ...initScore(),
});

export const initCompositionStats = (
  ships: Ships[],
  faction: XWSFaction
): CompositionStats => ({
  ships,
  faction,
  xws: [],
  record: { wins: 0, ties: 0, losses: 0 },
  ranks: [],
  ...initPerformance(),
  ...initFrequency(),
  ...initScore(),
});

/**
 * Initialiaze object that holds data collected from an event.
 */
export const initCollection = (): SquadDataCollection => {
  // Basic tournament data
  const tournament = {
    xws: 0,
    count: 0, // number of total squads
    cut: 0,
  };

  // Stats about factions (ranks, number of squads, ...)
  const faction = {
    rebelalliance: initCommonData(),
    galacticempire: initCommonData(),
    scumandvillainy: initCommonData(),
    resistance: initCommonData(),
    firstorder: initCommonData(),
    galacticrepublic: initCommonData(),
    separatistalliance: initCommonData(),
    unknown: initCommonData(),
  } satisfies SquadDataCollection['faction'];

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
  const pilot = initFactionMap<string, PilotDataCollection>();

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
  const ship = initFactionMap<Ships, ShipDataCollection>();

  const composition = {};

  // Upgrades stats
  const upgrade = {
    all: {},
    ...initFactionMap<string, UpgradeDataCollection>(),
  } satisfies FactionMapWithAll<string, UpgradeDataCollection>;

  return {
    tournament,
    faction,
    squadSizes,
    pilot,
    pilotCostDistribution,
    pilotSkillDistribution,
    ship,
    upgrade,
    composition,
  };
};

// Stats
// ---------------
export const initStats = (): SquadStats => {
  // Basic tournament data
  const tournament = {
    total: 0,
    xws: 0,
    count: 0,
    cut: 0,
  };

  // Stats about factions (ranks, number of squads, ...)
  const faction = {
    rebelalliance: { ...initCommonData(), ...initPerformance() },
    galacticempire: { ...initCommonData(), ...initPerformance() },
    scumandvillainy: { ...initCommonData(), ...initPerformance() },
    resistance: { ...initCommonData(), ...initPerformance() },
    firstorder: { ...initCommonData(), ...initPerformance() },
    galacticrepublic: { ...initCommonData(), ...initPerformance() },
    separatistalliance: { ...initCommonData(), ...initPerformance() },
    unknown: { ...initCommonData(), ...initPerformance() },
  } satisfies SquadStats['faction'];

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
  const pilot = initFactionMap<string, PilotStats>();

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
  const ship = initFactionMap<Ships, ShipStats>();

  // Composition of squads
  const composition: SquadStats['composition'] = {};

  // Upgrades stats
  const upgrade = {
    all: {},
    ...initFactionMap<string, UpgradeStats>(),
  } satisfies FactionMapWithAll<string, UpgradeStats>;

  return {
    tournament,
    faction,
    squadSizes,
    pilot,
    pilotCostDistribution,
    pilotSkillDistribution,
    ship,
    upgrade,
    composition,
  };
};

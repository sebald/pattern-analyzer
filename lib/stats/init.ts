import { Ships } from '../get-value';
import { XWSFaction } from '../types';
import {
  FactionMap,
  FactionDataCollection,
  PilotDataCollection,
  ShipDataCollection,
  FactionMapWithAll,
  UpgradeDataCollection,
  SuqadDataCollection,
} from './types';

// Utils
// ---------------
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

export const initFactionData = (): FactionDataCollection => ({
  count: 0,
  records: [],
  ranks: [],
});

/**
 * Initialiaze object that holds data collected from an event.
 */
export const init = (): SuqadDataCollection => {
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

  // Number of squads with the same ships (key = ship ids separated by "|")
  const shipComposition = new Map<string, number>();

  // Upgrades stats
  const upgrade: FactionMapWithAll<string, UpgradeDataCollection> = {
    all: {},
    ...initFactionMap<string, UpgradeDataCollection>(),
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

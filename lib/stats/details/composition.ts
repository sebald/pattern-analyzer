import { SquadEntitiyWithXWS } from '@/lib/db/types';
import type { Ships } from '@/lib/get-value';
import type { GameRecord, XWSFaction, XWSUpgrades } from '@/lib/types';
import { average, deviation, round, winrate } from '@/lib/utils/math.utils';

import {
  type DetailedSquadData,
  type GroupedDetailedSquadData,
  type PerformanceHistory,
  createHistory,
  createPilotsId,
  groupSquads,
  groupUpgrades,
} from './utils';

// Types
// ---------------
export interface SquadCompositionData {
  /**
   * Composition id (ships separated by ".")
   */
  id: string;
  faction: XWSFaction;
  count: number;
  record: GameRecord;
  percentiles: number[];

  pilot: {
    [id: string]: {
      ship: Ships;
      count: number;
      upgrades: XWSUpgrades[];
      record: GameRecord;
      percentiles: number[];
    };
  };

  squads: DetailedSquadData[];
}

export interface SquadCompositionStats {
  id: string;
  faction: XWSFaction;
  ships: Ships[];
  count: number;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;

  history: PerformanceHistory[];
  squads: GroupedDetailedSquadData;

  pilot: {
    [id: string]: {
      ship: Ships;
      upgrades: {
        id: string;
        list: XWSUpgrades;
        count: number;
        percentile: number;
      }[];
      count: number;
      frequency: number;
      winrate: number | null;
      percentile: number;
      deviation: number;
    };
  };
}

// Module
// ---------------
export interface CompositionDetailsProps {
  composition: string;
  squads: SquadEntitiyWithXWS[];
  count: { [Faction in XWSFaction]: number };
}

export const compositionDetails = ({
  composition,
  squads,
  count,
}: CompositionDetailsProps) => {
  const stats: SquadCompositionData = {
    id: composition,
    // Get first squad to derive faction
    faction: squads[0].faction,
    count: 0,
    record: { wins: 0, ties: 0, losses: 0 },
    percentiles: [],
    pilot: {},
    squads: [],
  };

  squads.forEach(current => {
    if (!current.xws) {
      console.log(current);
      return;
    }

    // Overall stats
    stats.count += 1;
    stats.record.wins += current.record.wins;
    stats.record.ties += current.record.ties;
    stats.record.losses += current.record.losses;
    stats.percentiles.push(current.percentile);

    stats.squads.push({
      id: createPilotsId(current.xws),
      tournamentId: current.tournamentId,
      player: current.player,
      xws: current.xws,
      date: current.date,
      record: current.record,
      rank: current.rank,
      percentile: current.percentile,
    });

    // Stats based on pilot
    current.xws.pilots.forEach(({ id: pid, ship, upgrades }) => {
      const pilot = stats.pilot[pid] || {
        ship,
        count: 0,
        upgrades: [],
        record: { wins: 0, ties: 0, losses: 0 },
        percentiles: [],
      };

      pilot.count += 1;
      pilot.upgrades.push(upgrades);
      pilot.record.wins += current.record.wins;
      pilot.record.ties += current.record.ties;
      pilot.record.losses += current.record.losses;
      pilot.percentiles.push(current.percentile);

      stats.pilot[pid] = pilot;
    });
  });

  // Generate Result
  const result: SquadCompositionStats = {
    id: stats.id,
    faction: stats.faction,
    ships: stats.id.split('.') as Ships[],
    count: stats.count,
    frequency: round(stats.count / count[stats.faction], 4),
    winrate: winrate([stats.record]),
    percentile: average(stats.percentiles, 4),
    deviation: deviation(stats.percentiles, 4),
    history: createHistory(stats.squads),
    squads: groupSquads(stats.squads),
    pilot: {}, // Filled below
  };

  // Pilots
  Object.entries(stats.pilot).forEach(([pid, pilot]) => {
    result.pilot[pid] = {
      ship: pilot.ship,
      upgrades: groupUpgrades(pilot),
      count: pilot.count,
      frequency: round(pilot.count / stats.count, 4),
      winrate: winrate([pilot.record]),
      percentile: average(pilot.percentiles, 4),
      deviation: deviation(pilot.percentiles, 4),
    };
  });

  return result;
};

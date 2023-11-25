import { SquadEntitiyWithXWS } from '@/lib/db/types';
import type { Ships } from '@/lib/get-value';
import type {
  GameRecord,
  XWSFaction,
  XWSSquad,
  XWSUpgrades,
} from '@/lib/types';
import { fromDate } from '@/lib/utils/date.utils';
import { average, deviation, round, winrate } from '@/lib/utils/math.utils';

import { PerformanceHistory, createHistory, createPilotsId } from './utils';
import type { SquadStatData } from './types';

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

  squads: SquadStatData[];
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

  /**
   * Grouped by pilots
   */
  squads: {
    [pilots: string]: {
      items: {
        xws: XWSSquad;
        date: string;
        player: string;
        tournamentId: number;
        rank: {
          swiss: number;
          elimination?: number;
        };
      }[];
      frequency: number;
      winrate: number | null;
      percentile: number;
      deviation: number;
    };
  };

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

// Helpers
// ---------------
const groupSquads = (squads: SquadCompositionData['squads']) => {
  const data: {
    [id: string]: {
      percentiles: number[];
      record: GameRecord;
      items: {
        xws: XWSSquad;
        date: string;
        tournamentId: number;
        player: string;
        rank: {
          swiss: number;
          elimination?: number;
        };
      }[];
    };
  } = {};
  const groups: SquadCompositionStats['squads'] = {};

  squads.forEach(squad => {
    const current = data[squad.id] || {
      record: {
        wins: 0,
        ties: 0,
        losses: 0,
      },
      percentiles: [],
      items: [],
    };

    current.record.wins += squad.record.wins;
    current.record.ties += squad.record.ties;
    current.record.losses += squad.record.losses;
    current.percentiles.push(squad.percentile);
    current.items.push({
      xws: squad.xws,
      date: squad.date,
      player: squad.player,
      tournamentId: squad.tournamentId,
      rank: squad.rank,
    });

    data[squad.id] = current;
  });

  Object.keys(data).forEach(id => {
    const current = data[id];
    current.items.sort(
      (a, b) => fromDate(b.date).getTime() - fromDate(a.date).getTime()
    );

    groups[id] = {
      items: current.items,
      frequency: round(current.items.length / squads.length, 4),
      winrate: winrate([current.record]),
      percentile: average(current.percentiles, 4),
      deviation: deviation(current.percentiles, 4),
    };
  });

  return groups;
};

/**
 * Group upgrades of one pilot if the upgrades
 * are exactly the same.
 */
const groupUpgrades = (value: {
  upgrades: XWSUpgrades[];
  percentiles: number[];
}) => {
  const getId = (us: XWSUpgrades) => {
    const val = Object.values(us).flat();
    val.sort();
    return val.join('.');
  };

  const data: {
    [id: string]: {
      count: number;
      list: XWSUpgrades;
      percentiles: number[];
    };
  } = {};
  const groups: {
    id: string;
    list: XWSUpgrades;
    count: number;
    percentile: number;
  }[] = [];

  value.upgrades.forEach((upgrades, idx) => {
    const id = getId(upgrades);
    const current = data[id] || {
      list: upgrades,
      count: 0,
      percentiles: [],
    };

    // Upgrades and percentile have same index
    current.percentiles.push(value.percentiles[idx]);
    current.count += 1;

    data[id] = current;
  });

  // map -> array
  Object.keys(data).forEach(id => {
    groups.push({
      id,
      count: data[id].count,
      percentile: average(data[id].percentiles, 4),
      list: data[id].list,
    });
  });

  groups.sort((a, b) => b.percentile - a.percentile);

  return groups;
};

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

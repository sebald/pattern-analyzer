import { getFactionByShip, type Ships } from '@/lib/get-value';
import type {
  GameRecord,
  SquadData,
  XWSFaction,
  XWSSquad,
  XWSUpgrades,
} from '@/lib/types';
import { fromDate, toMonth } from '@/lib/utils/date.utils';
import {
  average,
  deviation,
  percentile,
  round,
  winrate,
} from '@/lib/utils/math.utils';

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
      count: number;
      upgrades: XWSUpgrades[];
      record: GameRecord;
      percentiles: number[];
    };
  };

  squads: {
    /**
     * Pilot ids separated by "."
     */
    id: string;
    player: string;
    date: string;
    xws: XWSSquad;
    percentile: number;
    record: GameRecord;
  }[];
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

  trend: {
    /**
     * Date format YYYY-MM
     */
    date: string;
    count: number;
    percentile: number;
  }[];

  /**
   * Grouped by pilots
   */
  squads: {
    [pilots: string]: {
      items: {
        xws: XWSSquad;
        date: string;
        player: string;
      }[];
      frequency: number;
      winrate: number | null;
      percentile: number;
      deviation: number;
    };
  };

  pilot: {
    [id: string]: {
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
const createPilotsId = (xws: XWSSquad) => {
  const pilots = [...xws.pilots];
  pilots.sort((a, b) => {
    if (a.ship < b.ship) {
      return -1;
    }
    if (a.ship > b.ship) {
      return 1;
    }
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });

  return pilots.map(({ id }) => id).join('.');
};

const isComposition = (id: string, xws: XWSSquad) => {
  const ships = xws.pilots.map(p => p.ship);
  ships.sort();
  return id === ships.join('.');
};

const createTrends = (squads: SquadCompositionData['squads']) => {
  const trends: { [month: string]: { count: number; percentiles: number[] } } =
    {};

  squads.forEach(squad => {
    const date = toMonth(squad.date);

    const item = trends[date] || { count: 0, percentiles: [] };
    item.count += 1;
    item.percentiles.push(squad.percentile);

    trends[date] = item;
  });

  const result = Object.entries(trends).map(
    ([date, { count, percentiles }]) => ({
      date,
      count,
      percentile: average(percentiles, 4),
    })
  );

  result.sort(
    (a, b) =>
      new Date(fromDate(`${a.date}-01`)).getTime() -
      new Date(fromDate(`${b.date}-01`)).getTime()
  );

  return result;
};

const groupSquads = (squads: SquadCompositionData['squads']) => {
  const data: {
    [id: string]: {
      percentiles: number[];
      record: GameRecord;
      items: { xws: XWSSquad; date: string; player: string }[];
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
export const compositionDetails = (
  id: string,
  input: { date: string; squads: SquadData[] }[]
) => {
  const stats: SquadCompositionData = {
    id,
    // Get first ship to derive faction
    faction: getFactionByShip(id.split('.')[0] as Ships),
    squads: [],
    count: 0,
    record: { wins: 0, ties: 0, losses: 0 },
    percentiles: [],
    pilot: {},
  };

  let squadsInFaction = 0;

  input.forEach(({ date, squads }) => {
    const total = squads.length;

    squads.forEach(current => {
      if (!current.xws) return;

      if (stats.faction === current.xws.faction) {
        squadsInFaction += 1;
      }

      if (!isComposition(id, current.xws)) return;

      const pct = percentile(
        current.rank.elimination ?? current.rank.swiss,
        total
      );

      // Overall stats
      stats.count += 1;
      stats.record.wins += current.record.wins;
      stats.record.ties += current.record.ties;
      stats.record.losses += current.record.losses;
      stats.percentiles.push(pct);

      stats.squads.push({
        id: createPilotsId(current.xws),
        player: current.player,
        xws: current.xws,
        date,
        record: current.record,
        percentile: pct,
      });

      // Stats based on pilot
      current.xws.pilots.forEach(({ id: pid, upgrades }) => {
        const pilot = stats.pilot[pid] || {
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
        pilot.percentiles.push(pct);

        stats.pilot[pid] = pilot;
      });
    });
  });

  // Overall
  const result: SquadCompositionStats = {
    id: stats.id,
    faction: stats.faction,
    ships: stats.id.split('.') as Ships[],
    count: stats.count,
    frequency: round(stats.count / squadsInFaction, 4),
    winrate: winrate([stats.record]),
    percentile: average(stats.percentiles, 4),
    deviation: deviation(stats.percentiles, 4),
    trend: createTrends(stats.squads),
    squads: groupSquads(stats.squads),
    pilot: {}, // Filled below
  };

  // Pilots
  Object.entries(stats.pilot).forEach(([pid, pilot]) => {
    result.pilot[pid] = {
      count: pilot.count,
      upgrades: groupUpgrades(pilot),
      frequency: round(pilot.count / stats.count, 4),
      winrate: winrate([pilot.record]),
      percentile: average(pilot.percentiles, 4),
      deviation: deviation(pilot.percentiles, 4),
    };
  });

  return result;
};

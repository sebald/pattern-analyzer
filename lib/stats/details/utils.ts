import { fromDate, toMonth } from '@/lib/utils/date.utils';
import { average, deviation, round, winrate } from '@/lib/utils/math.utils';
import type { GameRecord, XWSSquad } from '@/lib/types';

/**
 * Create a composition id from XWS (pilot ids separated by a ".")
 */
export const createPilotsId = (xws: XWSSquad) => {
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

// Create performance history
// ---------------
export interface PerformanceHistory {
  /**
   * Date format YYYY-MM
   */
  date: string;
  count: number;
  percentile: number;
}

export const createHistory = (list: { date: string; percentile: number }[]) => {
  const history: { [month: string]: { count: number; percentiles: number[] } } =
    {};

  list.forEach(current => {
    const date = toMonth(current.date);

    const item = history[date] || { count: 0, percentiles: [] };
    item.count += 1;
    item.percentiles.push(current.percentile);

    history[date] = item;
  });

  const result = Object.entries(history).map(
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

  return result satisfies PerformanceHistory[];
};

// Group Squads by Pilot
// ---------------
export interface DetailedSquadData {
  /**
   * Pilot ids separated by "."
   */
  id: string;
  tournamentId: number;
  player: string;
  date: string;
  xws: XWSSquad;
  percentile: number;
  record: GameRecord;
  rank: {
    swiss: number;
    elimination?: number;
  };
}

export interface GroupedDetailedSquadData {
  /**
   * Pilot ids separated by "."
   */
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
}

export const groupSquads = (squads: DetailedSquadData[]) => {
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
  const groups: GroupedDetailedSquadData = {};

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

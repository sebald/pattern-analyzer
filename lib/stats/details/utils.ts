import { fromDate, toMonth } from '@/lib/utils/date.utils';
import { average } from '@/lib/utils/math.utils';
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
export interface SquadStatData {
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

export const createHistory = (squads: SquadStatData[]) => {
  const history: { [month: string]: { count: number; percentiles: number[] } } =
    {};

  squads.forEach(squad => {
    const date = toMonth(squad.date);

    const item = history[date] || { count: 0, percentiles: [] };
    item.count += 1;
    item.percentiles.push(squad.percentile);

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

  return result;
};

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

import { unstable_cache } from 'next/cache';

import { pointsUpdateDate } from '@/lib/config';
import { getSquadsCount } from '@/lib/db/squads';
import {
  fromDate,
  importDate,
  isSameDate,
  toDate,
} from '@/lib/utils/date.utils';
import { parseDateRange, type ParamsError } from '@/lib/utils/params.utils';

/**
 * How many squads the window since the last points update has to hold before it
 * is considered meaningful. Below that we widen the window, otherwise every
 * stats page would be empty for the first weeks of a new meta.
 */
export const MIN_SQUADS = 50;

export interface StatsRange {
  from: Date;
  to?: Date;
  /**
   * `true` if the window had to be widened because there is not enough data
   * since the last points update yet.
   */
  fallback: boolean;
}

export type StatsRangeResult = ParamsError | (StatsRange & { error: false });

/**
 * The same lookup runs for every stats page and, while prerendering, for every
 * single detail page. It only depends on the points update, so cache it for as
 * long as the pages themselves are revalidated.
 *
 * Note: only the count is cached, dates do not survive the cache serialization.
 */
const countSquads = unstable_cache(
  async (from: string, to?: string) => getSquadsCount({ from, to }),
  ['stats-range-squads-count'],
  { revalidate: 21600 } // 6 hours
);

/**
 * The window used when no explicit range was requested: since the last points
 * update, widened while that window does not hold enough data.
 */
export const defaultStatsRange = async (to?: Date): Promise<StatsRange> => {
  const from = fromDate(pointsUpdateDate);
  const count = await countSquads(
    pointsUpdateDate,
    to ? toDate(to) : undefined
  );

  if (count >= MIN_SQUADS) {
    return { from, to, fallback: false };
  }

  const widened = importDate(pointsUpdateDate);
  return { from: widened, to, fallback: !isSameDate(widened, from) };
};

/**
 * Resolves the window all stats are calculated for. An explicit range from the
 * URL always wins, everything else falls back to `defaultStatsRange`.
 */
export const statsRange = async (
  searchParams: object
): Promise<StatsRangeResult> => {
  const params = parseDateRange(searchParams);

  if (params.error) {
    return params;
  }

  if (params.from) {
    return { error: false, from: params.from, to: params.to, fallback: false };
  }

  return { error: false, ...(await defaultStatsRange(params.to)) };
};

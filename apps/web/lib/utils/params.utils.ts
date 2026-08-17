import { z } from 'zod';

import { pointsUpdateDate } from '../config';
import { fromDate, lastWeekend, monthsAgo, toDate } from './date.utils';

// Note: only checks the format, can still produce invalid dates (like 2022-02-31)
const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;

const schema = z.object({
  from: z.string().regex(DATE_REGEX).optional(),
  to: z.string().regex(DATE_REGEX).optional(),
});

export interface ParamsError {
  error: true;
  message: string;
}

export type ParsedDateRange =
  | ParamsError
  | { error: false; from?: Date; to?: Date };

/**
 * Parses `searchParams` into an explicit date range. `from` is undefined when
 * the params do not contain a range, the default is resolved by `statsRange`.
 */
export const parseDateRange = (searchParams: object): ParsedDateRange => {
  const result = schema.safeParse(searchParams);

  if (!result.success) {
    return {
      error: true,
      message: result.error.toString(),
    };
  }

  const { from, to } = result.data;

  return {
    error: false,
    from: from ? fromDate(from) : undefined,
    to: to ? fromDate(to) : undefined,
  };
};

/**
 * Transforms a date range string ('YYYY-MM-DD/YYYY-MM-DD') to an object with
 * `from` and `to` value, time set to midnight.
 */
export const fromDateRange = (val: string) => {
  const [from, to] = val.split('/');
  return { from, to: to ? to : null };
};

/**
 * Options shared by all date range filters. The wider windows are only added
 * once the last points update is older, so a selected range never spans two
 * metas.
 *
 * `defaultValue` is what "Last Points Update" maps to. URL based filters use an
 * empty string (= no param), so the default stays resolvable server side.
 */
export const dateRangePresets = (defaultValue = '') => ({
  'Last Points Update': defaultValue,
  'Last Weekend': toDate.apply(null, lastWeekend()),
  'Last Month': toDate(monthsAgo(1)),
  ...(fromDate(pointsUpdateDate) < monthsAgo(3)
    ? { 'Last 3 Months': toDate(monthsAgo(3)) }
    : {}),
  ...(fromDate(pointsUpdateDate) < monthsAgo(6)
    ? { 'Last 6 Months': toDate(monthsAgo(6)) }
    : {}),
});

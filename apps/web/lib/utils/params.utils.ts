import { z } from 'zod';
import { pointsUpdateDate } from '../config';
import { fromDate } from './date.utils';

// Note: only checks the format, can still produce invalid dates (like 2022-02-31)
const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;

const schema = z.object({
  from: z.string().regex(DATE_REGEX).optional(),
  to: z.string().regex(DATE_REGEX).optional(),
});

/**
 * Parses `searchParams` and will return a date range or an error.
 */
export const toDateRange = (
  searchParams: object
):
  | { error: true; message: string }
  | { from: Date; to?: Date; error: false } => {
  const result = schema.safeParse(searchParams);

  if (!result.success) {
    return {
      error: true,
      message: result.error.toString(),
    };
  }

  const { data } = result;

  const from =
    data && data.from ? fromDate(data.from) : fromDate(pointsUpdateDate);
  const to = data && data.to ? fromDate(data.to) : undefined;

  return { from, to, error: false };
};

/**
 * Transforms a date range string ('YYYY-MM-DD/YYYY-MM-DD') to an object with
 * `from` and `to` value, time set to midnight.
 */
export const fromDateRange = (val: string) => {
  const [from, to] = val.split('/');
  return { from, to: to ? to : null };
};

import dayjs from 'dayjs';

/**
 * Returns a date that was given days ago, with time set to midnight.
 */
export const daysAgo = (val: number) =>
  dayjs().startOf('day').subtract(val, 'day').toDate();

/**
 * Returns a date that was given months ago, with time set to midnight.
 */
export const monthsAgo = (val: number) =>
  dayjs().startOf('day').subtract(val, 'month').toDate();

/**
 * Returns a today's date, with time set to midnight.
 */
export const today = () => dayjs().startOf('day').toDate();

/**
 * Returns the last weekend, starting on Thurdays :D
 */
export const lastWeekend = () => {
  const thursday = dayjs().day(4).subtract(7, 'day');
  return [thursday.toDate(), thursday.add(3, 'day').toDate()];
};

/**
 * Checks if two dates are equal.
 */
export const isSameDate = (a: Date, b: Date) => dayjs(a).isSame(dayjs(b));

/**
 * Transforms a date string ('YYYY-MM-DD') to date object, with time set to midnight.
 */
export const fromDate = (val: string) =>
  dayjs(val, 'YYYY-MM-DD').startOf('day').toDate();

/**
 * Transforms a date object to a date string ('YYYY-MM-DD'). If multiple dates
 * are passed, it will return a date range ('YYYY-MM-DD/YYYY-MM-DD') instead.
 */
export const toDate = (from: Date, to?: Date) => {
  const start = dayjs(from).format('YYYY-MM-DD');
  return to ? `${start}/${dayjs(to).format('YYYY-MM-DD')}` : start;
};

/**
 * Formats date to a human readable format.
 */
export const formatDate = (date: Date) => {
  const locale =
    typeof window === 'undefined' ? 'en' : window.navigator?.language;

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

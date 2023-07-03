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
 * Checks if two dates are equal.
 */
export const isSameDate = (a: Date, b: Date) => dayjs(a).isSame(dayjs(b));

/**
 * Transforms a date string ('YYYY-MM-DD') to date object, with time set to midnight.
 */
export const fromDate = (val: string) =>
  dayjs(val, 'YYYY-MM-DD').startOf('day').toDate();

/**
 * Transforms a date object to a date string ('YYYY-MM-DD').
 */
export const toDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');

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

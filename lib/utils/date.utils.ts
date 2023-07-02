import dayjs from 'dayjs';

/**
 * Returns a date that was given days ago, with time set to midnight.
 */
export const daysAgo = (val: number) =>
  dayjs().startOf('day').subtract(val, 'day').toDate();

/**
 * Returns a today's date, with time set to midnight.
 */
export const today = () => dayjs().startOf('day').toDate();

export const formatDate = (date: Date) => {
  const locale =
    typeof window === 'undefined' ? 'en' : window.navigator?.language;

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

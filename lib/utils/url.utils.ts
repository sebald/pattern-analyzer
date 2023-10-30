// Note: only checks the format, can still produce invalid dates (like 2022-02-31)
const DATE_RANGE_REGEX =
  /(?<from>\d{4}-(\d{2})-(\d{2}))(?:\.(?<to>\d{4}-(\d{2})-(\d{2})))?/;

export const fromDateRange = (val: string = '') => {
  const result = val.match(DATE_RANGE_REGEX);
  return result ? result.groups! : null;
};

export const toDateRange = (from: string, to?: string) =>
  to ? `${from}.${to}` : from;

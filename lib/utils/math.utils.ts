/**
 * Round given number to digits.
 */
export const round = (val: number, digits: number) =>
  Number(val.toFixed(digits));

export interface ToPercentageOptions {
  sign?: boolean;
}

/**
 * Format given number to percentage.
 */
export const toPercentage = (
  value: number,
  options: ToPercentageOptions = {}
) =>
  new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    signDisplay: options.sign ? 'exceptZero' : 'auto',
  }).format(value);

/**
 * Calculate average (not weighted).
 */
export const average = (vals: number[], digits = 2) =>
  round(
    vals.length ? vals.reduce((sum, n) => sum + n, 0) / vals.length : 0,
    digits
  );

/**
 * Calculate weighted average.
 */
export const weightedAverage = (
  map: { [key: number]: number },
  total: number
) =>
  Object.entries(map).reduce((mean, [size, count]) => {
    mean = mean + Number(size) * count;
    return mean;
  }, 0) / total;

/**
 * Calculate winrate (in %).
 */
export const winrate = (
  records: { wins: number; ties: number; losses: number }[]
) => {
  let wins = 0;
  let total = 0;

  records.forEach(record => {
    wins = wins + record.wins;
    total = Object.values(record).reduce((t, num) => t + num, total);
  });

  return total === 0 ? null : round(wins / total, 4);
};

/**
 * Calculate percentile based on a rank.
 * https://www.cuemath.com/percentile-formula/
 */
export const percentile = (rank: number, total: number) =>
  round(Math.max((total - rank) / (total - 1), 0), 4);

/**
 * Calculate standard deviation.
 * https://www.cuemath.com/data/standard-deviation/
 */
export const deviation = (vals: number[], digits = 4) => {
  const avg = average(vals, 4);

  const sum = vals
    .map(val => (val - avg) ** 2)
    .reduce((acc, val) => acc + val, 0);

  return round(Math.sqrt(sum / vals.length), digits);
};

/**
 * Create an array with every possible combinations
 */
export const combinations = (array: string[]) =>
  array.flatMap((v, i) => array.slice(i + 1).map(w => [v, w]));

/**
 * Create every subset of given array.
 */
export const createSubsets = <T>(array: T[]) =>
  array.reduce((set, value) => set.concat(set.map(set => [...set, value])), [
    [],
  ] as T[][]);

/**
 * Check if something is a subset.
 */
export const isSubset = <T>(needle: T[], stack: T[]) =>
  needle.every(
    val =>
      stack.includes(val) &&
      needle.filter(el => el === val).length <=
        stack.filter(el => el === val).length
  );

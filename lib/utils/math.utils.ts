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

  return total === 0 ? 0 : round(wins / total, 4);
};

/**
 * Calculate percentile based on a rank.
 * https://www.cuemath.com/percentile-formula/
 */
export const percentile = (rank: number, total: number) =>
  round((total - rank) / total, 4);

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

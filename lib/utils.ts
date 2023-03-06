import { twMerge } from 'tailwind-merge';

export const cn = (...cns: Parameters<typeof twMerge>) => twMerge(...cns);

// Stolen from https://stackoverflow.com/questions/68702774/longest-common-prefix-in-javascript
export const prefix = (...words: string[]) => {
  // check border cases size 1 array and empty first word)
  if (!words[0] || words.length == 1) return words[0] || '';
  let i = 0;
  // while all words have the same character at position i, increment i
  while (words[0][i] && words.every(w => w[i] === words[0][i])) i++;

  // prefix is the substring from the beginning to the last successfully checked i
  return words[0].substring(0, i);
};

/**
 * Find the common part of event titles and uses it as prefix, rest will be
 * appended with "&" as the separator.
 */
export const shortenTitles = (...titles: string[]) => {
  const common = prefix(...titles.filter(Boolean));
  const suffixes = titles.map(title => title.substring(common.length));

  return `${common}${suffixes.filter(Boolean).join(' & ')}`;
};

export const round = (val: number, digits: number) =>
  Number(val.toFixed(digits));

export const average = (vals: number[], digits = 2) =>
  round(vals.reduce((sum, n) => sum + n, 0) / vals.length, digits);

/**
 * Calculate performance (win %).
 */
export const performance = (
  records: { wins: number; ties: number; losses: number }[]
) => {
  let wins = 0;
  let total = 0;

  records.forEach(record => {
    wins = wins + record.wins;
    total = Object.values(record).reduce((t, num) => t + num, total);
  });

  return round(wins / total, 4);
};

/**
 * Calculate percentile based on a rank.
 * https://www.cuemath.com/percentile-formula/
 */
export const percentile = (rank: number, total: number) =>
  round((total - rank) / total, 4) * 100;

/**
 * Calculate standard deviation.
 * https://www.cuemath.com/data/standard-deviation/
 */
export const deviation = (vals: number[]) => {
  const avg = average(vals, 4);

  const sum = vals
    .map(val => (val - avg) ** 2)
    .reduce((acc, val) => acc + val, 0);

  return round(Math.sqrt(sum / vals.length), 4);
};

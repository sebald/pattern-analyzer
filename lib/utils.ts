import { twMerge } from 'tailwind-merge';

export const cn = (...cns: Parameters<typeof twMerge>) => twMerge(...cns);

export const round = (val: number, digits: number) =>
  Number(val.toFixed(digits));

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

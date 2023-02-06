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

/**
 * Create an array with every possible combinations
 */
export const combinations = (array: string[]) =>
  array.flatMap((v, i) => array.slice(i + 1).map(w => [v, w]));

export const createSubsets = <T>(array: T[]) =>
  array.reduce((set, value) => set.concat(set.map(set => [...set, value])), [
    [],
  ] as T[][]);

export const isSubset = <T>(needle: T[], stack: T[]) =>
  needle.every(
    val =>
      stack.includes(val) &&
      needle.filter(el => el === val).length <=
        stack.filter(el => el === val).length
  );

import { twMerge } from 'tailwind-merge';
import { SquadData } from './types';

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

type CleandSquad = Omit<SquadData, 'raw'>;

/**
 * Exports squads data as CSV.
 * `raw` is omited since it can break the CSV format (no lines are bad).
 */
export const squadsToCSV = (squads: SquadData[]) => {
  const data: CleandSquad[] = squads.map(({ raw, ...rest }) => ({ ...rest }));
  const headers = Object.keys(data[0]) as (keyof CleandSquad)[];
  const delimiter = ';';

  const createRow = (
    row: CleandSquad,
    headerKeys: (keyof CleandSquad)[],
    delimiter: string
  ) =>
    headerKeys
      .map(key => {
        const entry = row[key];

        switch (typeof entry) {
          case 'number':
            return entry;
          case 'object':
            return entry ? JSON.stringify(entry) : '';
          default:
            return `${entry}`.replace(/"/g, '""');
        }
      })
      .join(delimiter);

  let csv = data.map(squad => createRow(squad, headers, delimiter));
  csv.unshift(headers.join(delimiter));

  return csv.join('\r\n');
};

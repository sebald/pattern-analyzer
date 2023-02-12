import type { SquadData } from './types';

type CleanedSquad = Omit<SquadData, 'raw'>;

/**
 * Exports squads data as CSV.
 * `raw` is omited since it can break the CSV format (no lines are bad).
 */
export const squadsToCSV = (squads: SquadData[]) => {
  const data: CleanedSquad[] = squads.map(({ raw, ...rest }) => ({ ...rest }));
  const headers = Object.keys(data[0]) as (keyof CleanedSquad)[];
  const delimiter = ';';

  const createRow = (
    row: CleanedSquad,
    headerKeys: (keyof CleanedSquad)[],
    delimiter: string
  ) =>
    headerKeys
      .map(key => {
        const entry = row[key];

        switch (typeof entry) {
          case 'number':
            return entry;
          case 'object':
            if (entry === null) {
              return '';
            }

            if (key === 'record' && 'wins' in entry) {
              return `${entry.wins}-${entry.ties}-${entry.losses}`;
            }

            return JSON.stringify(entry);
          default:
            return `${entry}`.replace(/"/g, '""');
        }
      })
      .join(delimiter);

  let csv = data.map(squad => createRow(squad, headers, delimiter));
  csv.unshift(headers.join(delimiter));

  return csv.join('\r\n');
};

export const squadToListfortress = (squads: SquadData[]) => {
  /**
   * It looks like list exports could take a while since we need to fetch additional data.
   * Make we make a new page for listfortress export?
   *
   * longshanks has the games in the same part as the lists in their "pop"
   *
   * Do we need to store this in a map with "player ids + round" as keys so we do not have duplicate games
   * -> skip scraping if game is already in map
   *
   * .game (root for each game)
   *
   * > .results
   *    > .player (2 elements)
   *          >.id_number == ids as "#1234"
   *          >.score == victory points
   *
   * > .details
   *    > item:2:last-child == round
   *    > item:3:last-child == scenario
   */
};

import type {
  EventData,
  ListfortressPlayer,
  ListfortressRound,
  SquadData,
} from './types';

type CleanedSquad = Omit<SquadData, 'raw'>;

/**
 * Exports squads data as CSV.
 * `raw` is omited since it can break the CSV format (no lines are bad).
 */
export const squadsToCSV = (squads: SquadData[]) => {
  const data: CleanedSquad[] = squads.map(({ raw, ...rest }) => ({ ...rest }));
  const headers = Object.keys(data[0] || {}) as (keyof CleanedSquad)[];
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

export interface EventToListfortressProps {
  squads: SquadData[];
  rounds: ListfortressRound[];
}

export const eventToListfortress = ({
  squads,
  rounds,
}: EventToListfortressProps) => {
  const players: ListfortressPlayer[] = squads.map(
    ({ id, player, points, sos, mov, rank, dropped, xws }) => ({
      id,
      name: player,
      score: points,
      sos,
      mov,
      rank,
      dropped,
      list: xws ? JSON.stringify(xws) : '',
    })
  );

  return {
    players,
    rounds,
  };
};

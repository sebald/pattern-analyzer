import { ListfortressTournamentInfo } from '../types';

export const FORMAT_MAP = {
  standard: 36, // 2.5 Standard actually
  legacy: 37,
};

export interface TournamentFilter {
  /**
   * Filter by tournament name (substring)
   */
  q?: string | null;
  /**
   * Filter by tournament type
   */
  format?: keyof typeof FORMAT_MAP | null;
  /**
   * Tournaments occured at or after given date.
   */
  from?: Date;
  /**
   * Tournaments occured at or before given date.
   */
  to?: Date;
}

export const getAllTournaments = async ({
  q,
  format,
  from,
  to,
}: TournamentFilter) => {
  const api_url = 'https://listfortress.com/api/v1/tournaments/';
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error('[listfortress] Failed to fetch events...');
  }

  const tournaments: ListfortressTournamentInfo[] = await res.json();

  return tournaments.filter(t => {
    // Includes given name
    if (q && !t.name.toLocaleLowerCase().includes(q.toLocaleLowerCase())) {
      return false;
    }

    // Include only certain format
    if (format && FORMAT_MAP[format] !== t.format_id) {
      return false;
    }

    // Occured in given time frame
    const date = new Date(t.date);

    if (from && date < from) {
      return false;
    }

    if (to && date > to) {
      return false;
    }

    return true;
  });
};

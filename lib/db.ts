import { Client, ExecutedQuery } from '@planetscale/database';

import { pointsUpdateDate } from '@/lib/config';
import { toDate, today } from '@/lib/utils/date.utils';

// Config
// ---------------
const client = new Client({
  url: process.env.DATABASE_URL,
});

// Tournaments
// ---------------
export interface TournamentsFilter {
  /**
   * Tournaments occured at or after given date.
   */
  from?: Date;
  /**
   * Tournaments occured at or before given date.
   */
  to?: Date;
}

export const getTournaments = async ({ from, to }: TournamentsFilter) => {
  const connection = client.connection();
  let result: ExecutedQuery;

  try {
    result = await connection.execute(
      `SELECT listfortress_ref AS id, name, date
      FROM tournaments WHERE date BETWEEN '${
        from ? toDate(from) : pointsUpdateDate
      }' AND '${toDate(to || today())}';`
    );
  } catch {
    throw new Error(`Failed to fetch tournaments...`);
  }

  return result.rows as { id: number; name: string; date: string }[];
};

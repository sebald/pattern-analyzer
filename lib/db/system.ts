import { db } from './db';

// Last Sync
// ---------------
export const getLastSync = async () => {
  const { value } = await db
    .selectFrom('system')
    .select('value')
    .where('key', '=', 'last_sync')
    .executeTakeFirstOrThrow();

  return new Date(value);
};

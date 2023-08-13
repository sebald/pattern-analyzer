import { now } from '@/lib/utils/date.utils';
import { db } from './db';

// Last Sync
// ---------------
export const setLastSync = async () =>
  db
    .insertInto('system')
    .values({ key: 'last_sync', value: now() })
    .onDuplicateKeyUpdate({ key: 'last_sync' });

export const getLastSync = async () => {
  const { value } = await db
    .selectFrom('system')
    .select('value')
    .where('key', '=', 'last_sync')
    .executeTakeFirstOrThrow();

  return new Date(value);
};

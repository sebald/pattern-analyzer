import { MIN_SQUADS, defaultStatsRange, statsRange } from '@/lib/stats/range';
import { monthsAgo, toDate } from '@/lib/utils/date.utils';

var mockPointsUpdate = '';
var mockSquadsCount = 0;

jest.mock('@/lib/config', () => ({
  get pointsUpdateDate() {
    return mockPointsUpdate;
  },
}));

jest.mock('@/lib/db/squads', () => ({
  getSquadsCount: async () => mockSquadsCount,
}));

// Pulls in server internals that the jsdom environment does not provide.
jest.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}));

test('uses the last points update if it holds enough data', async () => {
  mockPointsUpdate = toDate(monthsAgo(1));
  mockSquadsCount = MIN_SQUADS;

  const range = await defaultStatsRange();

  expect(toDate(range.from)).toBe(mockPointsUpdate);
  expect(range.fallback).toBe(false);
});

/**
 * Regression: right after a points update there is no data yet, which used to
 * leave every stats page (and every detail page) empty.
 */
test('widens the window while there is not enough data yet', async () => {
  mockPointsUpdate = toDate(monthsAgo(1));
  mockSquadsCount = MIN_SQUADS - 1;

  const range = await defaultStatsRange();

  expect(toDate(range.from)).toBe(toDate(monthsAgo(6)));
  expect(range.fallback).toBe(true);
});

test('does not widen if the points update is older than the fallback', async () => {
  mockPointsUpdate = toDate(monthsAgo(9));
  mockSquadsCount = 0;

  const range = await defaultStatsRange();

  expect(toDate(range.from)).toBe(mockPointsUpdate);
  expect(range.fallback).toBe(false);
});

test('an explicit range wins over the default', async () => {
  mockPointsUpdate = toDate(monthsAgo(1));
  mockSquadsCount = 0;

  const range = await statsRange({ from: '2024-01-01', to: '2024-02-01' });

  expect(range).toMatchObject({ error: false, fallback: false });
  expect(toDate((range as { from: Date }).from)).toBe('2024-01-01');
});

test('reports invalid params', async () => {
  expect(await statsRange({ from: 'not-a-date' })).toMatchObject({
    error: true,
  });
});

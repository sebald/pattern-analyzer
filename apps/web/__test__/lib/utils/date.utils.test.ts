import {
  importDate,
  monthRange,
  monthsAgo,
  toDate,
} from '@/lib/utils/date.utils';

test('to date range', () => {
  expect(
    toDate(new Date(2023, 0, 1), new Date(2023, 1, 1))
  ).toMatchInlineSnapshot(`"2023-01-01/2023-02-01"`);
  expect(toDate(new Date(2023, 0, 1))).toMatchInlineSnapshot(`"2023-01-01"`);
});

test('import date falls back to the last six months for a recent points update', () => {
  expect(toDate(importDate(toDate(monthsAgo(1))))).toBe(toDate(monthsAgo(6)));
});

test('import date uses the points update if it is older than six months', () => {
  const pointsUpdate = toDate(monthsAgo(9));
  expect(toDate(importDate(pointsUpdate))).toBe(pointsUpdate);
});

test('create date range', () => {
  expect(monthRange(new Date(2000, 0, 1), new Date(2000, 5, 1)))
    .toMatchInlineSnapshot(`
[
  "2000-01",
  "2000-02",
  "2000-03",
  "2000-04",
  "2000-05",
  "2000-06",
]
`);
});

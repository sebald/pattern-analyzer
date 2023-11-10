import { monthRange, toDate } from '@/lib/utils/date.utils';

test('to date range', () => {
  expect(
    toDate(new Date(2023, 0, 1), new Date(2023, 1, 1))
  ).toMatchInlineSnapshot(`"2023-01-01/2023-02-01"`);
  expect(toDate(new Date(2023, 0, 1))).toMatchInlineSnapshot(`"2023-01-01"`);
});

test('create date range', () => {
  expect(
monthRange(new Date(2000, 0, 1), new Date(2000, 5, 1))).
toMatchInlineSnapshot(`
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

import { toDate } from '@/lib/utils/date.utils';

test('date range', () => {
  expect(
    toDate(new Date(2023, 0, 1), new Date(2023, 1, 1))
  ).toMatchInlineSnapshot(`"2023-01-01/2023-02-01"`);
  expect(toDate(new Date(2023, 0, 1))).toMatchInlineSnapshot(`"2023-01-01"`);
});

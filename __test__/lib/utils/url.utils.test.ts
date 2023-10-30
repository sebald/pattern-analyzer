import { fromDateRange } from '@/lib/utils/url.utils';

test('extract date range', () => {
  expect(fromDateRange('')).toMatchInlineSnapshot(`null`);

  expect(fromDateRange('2022-01-01')).toMatchInlineSnapshot(`
{
  "from": "2022-01-01",
  "to": undefined,
}
`);

  expect(fromDateRange('2022-01-01.2022-01-05')).toMatchInlineSnapshot(`
{
  "from": "2022-01-01",
  "to": "2022-01-05",
}
`);
});

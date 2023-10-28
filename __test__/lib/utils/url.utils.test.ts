import { toRange } from '@/lib/utils/url.utils';

test('extract date range', () => {
  expect(toRange('')).toMatchInlineSnapshot(`null`);

  expect(toRange('2022-01-01')).toMatchInlineSnapshot(`
{
  "from": "2022-01-01",
  "to": undefined,
}
`);

  expect(toRange('2022-01-01.2022-01-05')).toMatchInlineSnapshot(`
{
  "from": "2022-01-01",
  "to": "2022-01-05",
}
`);
});

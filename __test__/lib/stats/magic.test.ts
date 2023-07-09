import { magic } from '@/lib/stats/magic';

/**
 * Not really testing but rather finding out how to create a "good" scale
 */
test('it is magic!', () => {
  const input = { percentile: 0.5, deviation: 0.1 };
  expect(magic({ ...input, count: 1 })).toMatchInlineSnapshot(`1.2`);
  expect(magic({ ...input, count: 2 })).toMatchInlineSnapshot(`2.77`);
  expect(magic({ ...input, count: 10 })).toMatchInlineSnapshot(`9.21`);
  expect(magic({ ...input, count: 20 })).toMatchInlineSnapshot(`11.98`);
  expect(magic({ ...input, count: 50 })).toMatchInlineSnapshot(`15.65`);
  expect(magic({ ...input, count: 100 })).toMatchInlineSnapshot(`18.42`);
  expect(magic({ ...input, count: 200 })).toMatchInlineSnapshot(`21.19`);
});

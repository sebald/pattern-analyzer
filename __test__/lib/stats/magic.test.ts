import { magic } from '@/lib/stats/magic';

/**
 * Not really testing but rather finding out how to create a "good" scale
 */
test('it is magic!', () => {
  const input = { percentile: 0.5, deviation: 0.1 };
  expect(magic({ ...input, count: 1 })).toMatchInlineSnapshot(`1.5`);
  expect(magic({ ...input, count: 2 })).toMatchInlineSnapshot(`3.47`);
  expect(magic({ ...input, count: 10 })).toMatchInlineSnapshot(`11.51`);
  expect(magic({ ...input, count: 20 })).toMatchInlineSnapshot(`14.98`);
  expect(magic({ ...input, count: 50 })).toMatchInlineSnapshot(`19.56`);
  expect(magic({ ...input, count: 100 })).toMatchInlineSnapshot(`23.03`);
  expect(magic({ ...input, count: 200 })).toMatchInlineSnapshot(`26.49`);
});

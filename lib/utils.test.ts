import { average, deviation, percentile, performance, prefix } from './utils';

test('return common prefix of string', () => {
  expect(prefix('abc', 'abc')).toEqual('abc');
  expect(prefix('this is just a test', 'this is just a experiment')).toEqual(
    'this is just a '
  );
  expect(prefix('zbc', 'abc')).toEqual('');
});

test('calcualte average', () => {
  expect(average([1, 1, 1])).toMatchInlineSnapshot(`1`);
  expect(average([1, 3, 2])).toMatchInlineSnapshot(`2`);
  expect(average([3, 3, 3])).toMatchInlineSnapshot(`3`);
  expect(average([1, 10])).toMatchInlineSnapshot(`5.5`);
});

test('calculate performance', () => {
  expect(performance([{ wins: 3, ties: 0, losses: 0 }])).toMatchInlineSnapshot(
    `1`
  );
  expect(performance([{ wins: 0, ties: 2, losses: 1 }])).toMatchInlineSnapshot(
    `0`
  );
  expect(performance([{ wins: 3, ties: 2, losses: 1 }])).toMatchInlineSnapshot(
    `0.5`
  );
  expect(
    performance([
      { wins: 3, ties: 0, losses: 0 },
      { wins: 3, ties: 0, losses: 0 },
    ])
  ).toMatchInlineSnapshot(`1`);
  expect(
    performance([
      { wins: 3, ties: 0, losses: 0 },
      { wins: 0, ties: 0, losses: 3 },
    ])
  ).toMatchInlineSnapshot(`0.5`);
  expect(
    performance([
      { wins: 1, ties: 2, losses: 0 },
      { wins: 2, ties: 1, losses: 1 },
    ])
  ).toMatchInlineSnapshot(`0.4286`);
});

test('calculate percentile', () => {
  expect(percentile(1, 7)).toMatchInlineSnapshot(`85.71`);
  expect(percentile(2, 7)).toMatchInlineSnapshot(`71.43`);
  expect(percentile(3, 7)).toMatchInlineSnapshot(`57.14`);
  expect(percentile(6, 7)).toMatchInlineSnapshot(`14.29`);
  expect(percentile(7, 7)).toMatchInlineSnapshot(`0`);

  expect(percentile(1, 16)).toMatchInlineSnapshot(`93.75`);
  expect(percentile(7, 16)).toMatchInlineSnapshot(`56.25`);
  expect(percentile(8, 16)).toMatchInlineSnapshot(`50`);
  expect(percentile(16, 16)).toMatchInlineSnapshot(`0`);

  expect(percentile(4, 20)).toMatchInlineSnapshot(`80`);
  expect(percentile(3, 12)).toMatchInlineSnapshot(`75`);
});

test('calculate deviation', () => {
  expect(deviation([1, 1, 1])).toMatchInlineSnapshot(`0`);
  expect(deviation([1, 4])).toMatchInlineSnapshot(`1.5`);
  expect(deviation([1, 2, 3])).toMatchInlineSnapshot(`0.8165`);
});

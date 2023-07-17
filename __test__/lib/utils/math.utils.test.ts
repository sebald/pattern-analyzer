import {
  average,
  deviation,
  percentile,
  winrate,
  round,
} from '@/lib/utils/math.utils';

test('round number', () => {
  expect(round(0, 2)).toMatchInlineSnapshot(`0`);
  expect(round(0, 4)).toMatchInlineSnapshot(`0`);
});

test('calcualte average', () => {
  expect(average([1, 1, 1])).toMatchInlineSnapshot(`1`);
  expect(average([1, 3, 2])).toMatchInlineSnapshot(`2`);
  expect(average([3, 3, 3])).toMatchInlineSnapshot(`3`);
  expect(average([1, 10])).toMatchInlineSnapshot(`5.5`);

  expect(average([])).toMatchInlineSnapshot(`0`);
});

test('calculate performance', () => {
  expect(winrate([{ wins: 3, ties: 0, losses: 0 }])).toMatchInlineSnapshot(`1`);
  expect(winrate([{ wins: 0, ties: 2, losses: 1 }])).toMatchInlineSnapshot(`0`);
  expect(winrate([{ wins: 3, ties: 2, losses: 1 }])).toMatchInlineSnapshot(
    `0.5`
  );
  expect(
    winrate([
      { wins: 3, ties: 0, losses: 0 },
      { wins: 3, ties: 0, losses: 0 },
    ])
  ).toMatchInlineSnapshot(`1`);
  expect(
    winrate([
      { wins: 3, ties: 0, losses: 0 },
      { wins: 0, ties: 0, losses: 3 },
    ])
  ).toMatchInlineSnapshot(`0.5`);
  expect(
    winrate([
      { wins: 1, ties: 2, losses: 0 },
      { wins: 2, ties: 1, losses: 1 },
    ])
  ).toMatchInlineSnapshot(`0.4286`);
});

test('calculate percentile', () => {
  expect(percentile(1, 7)).toMatchInlineSnapshot(`1`);
  expect(percentile(2, 7)).toMatchInlineSnapshot(`0.8333`);
  expect(percentile(3, 7)).toMatchInlineSnapshot(`0.6667`);
  expect(percentile(6, 7)).toMatchInlineSnapshot(`0.1667`);
  expect(percentile(7, 7)).toMatchInlineSnapshot(`0`);

  expect(percentile(1, 16)).toMatchInlineSnapshot(`1`);
  expect(percentile(7, 16)).toMatchInlineSnapshot(`0.6`);
  expect(percentile(8, 16)).toMatchInlineSnapshot(`0.5333`);
  expect(percentile(16, 16)).toMatchInlineSnapshot(`0`);

  expect(percentile(4, 20)).toMatchInlineSnapshot(`0.8421`);
  expect(percentile(3, 12)).toMatchInlineSnapshot(`0.8182`);

  expect(percentile(1, 10)).toMatchInlineSnapshot(`1`);
  expect(percentile(3, 10)).toMatchInlineSnapshot(`0.7778`);
});

test('calculate deviation', () => {
  expect(deviation([1, 1, 1])).toMatchInlineSnapshot(`0`);
  expect(deviation([1, 4])).toMatchInlineSnapshot(`1.5`);
  expect(deviation([1, 2, 3])).toMatchInlineSnapshot(`0.8165`);
});

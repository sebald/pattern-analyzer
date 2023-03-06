import { percentile, prefix } from './utils';

test('return common prefix of string', () => {
  expect(prefix('abc', 'abc')).toEqual('abc');
  expect(prefix('this is just a test', 'this is just a experiment')).toEqual(
    'this is just a '
  );
  expect(prefix('zbc', 'abc')).toEqual('');
});

test('return percentile', () => {
  expect(percentile(1, 7)).toEqual(1);
  expect(percentile(2, 7)).toEqual(0.8571);
  expect(percentile(3, 7)).toEqual(0.7143);
  expect(percentile(6, 7)).toEqual(0.2857);
  expect(percentile(7, 7)).toEqual(0.1429);

  expect(percentile(1, 16)).toEqual(1);
  expect(percentile(7, 16)).toEqual(0.625);
  expect(percentile(8, 16)).toEqual(0.5625);
  expect(percentile(16, 16)).toEqual(0.0625);
});

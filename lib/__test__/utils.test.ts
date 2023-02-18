import { prefix } from 'lib/utils';

test('return common prefix of string', () => {
  expect(prefix('abc', 'abc')).toEqual('abc');
  expect(prefix('this is just a test', 'this is just a experiment')).toEqual(
    'this is just a '
  );
  expect(prefix('zbc', 'abc')).toEqual('');
});

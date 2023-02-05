import { prefix, createSubsets } from 'lib/utils';

test('return common prefix of string', () => {
  expect(prefix('abc', 'abc')).toEqual('abc');
  expect(prefix('this is just a test', 'this is just a experiment')).toEqual(
    'this is just a '
  );
  expect(prefix('zbc', 'abc')).toEqual('');
});

test('create all subsets', () => {
  expect(createSubsets([])).toMatchInlineSnapshot(`
    [
      [],
    ]
  `);
  expect(createSubsets(['a'])).toMatchInlineSnapshot(`
    [
      [],
      [
        "a",
      ],
    ]
  `);
  expect(createSubsets(['a', 'b'])).toMatchInlineSnapshot(`
    [
      [],
      [
        "a",
      ],
      [
        "b",
      ],
      [
        "a",
        "b",
      ],
    ]
  `);
  expect(createSubsets(['a', 'b', 'c'])).toMatchInlineSnapshot(`
    [
      [],
      [
        "a",
      ],
      [
        "b",
      ],
      [
        "a",
        "b",
      ],
      [
        "c",
      ],
      [
        "a",
        "c",
      ],
      [
        "b",
        "c",
      ],
      [
        "a",
        "b",
        "c",
      ],
    ]
  `);
});

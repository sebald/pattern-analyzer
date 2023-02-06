import { prefix, createSubsets, isSubset } from 'lib/utils';

// Prefix
// ---------------
test('return common prefix of string', () => {
  expect(prefix('abc', 'abc')).toEqual('abc');
  expect(prefix('this is just a test', 'this is just a experiment')).toEqual(
    'this is just a '
  );
  expect(prefix('zbc', 'abc')).toEqual('');
});

// Create Subsets
// ---------------
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

// Is Subset?
// ---------------
test('is subset', () => {
  expect(isSubset([], [])).toBeTruthy();
  expect(isSubset(['a'], ['a'])).toBeTruthy();
  expect(isSubset(['a'], ['a', 'b'])).toBeTruthy();

  expect(isSubset(['a', 'b'], ['a'])).toBeFalsy();
  expect(isSubset(['a', 'c'], ['a', 'b'])).toBeFalsy();
});

test('is subset (with duplicates)', () => {
  expect(isSubset(['a'], ['a', 'a'])).toBeTruthy();
  expect(isSubset(['a', 'a'], ['a', 'a'])).toBeTruthy();
  expect(isSubset(['a', 'a'], ['a', 'a', 'a'])).toBeTruthy();
  expect(isSubset(['a', 'a'], ['a', 'a', 'b'])).toBeTruthy();
  expect(isSubset(['a', 'b'], ['a', 'a', 'b'])).toBeTruthy();
  expect(isSubset(['a', 'a', 'b'], ['a', 'a', 'b'])).toBeTruthy();

  expect(isSubset(['a', 'a'], ['a'])).toBeFalsy();
  expect(isSubset(['a', 'a', 'b'], ['a', 'b'])).toBeFalsy();
  expect(isSubset(['a', 'a', 'b'], ['a'])).toBeFalsy();
});

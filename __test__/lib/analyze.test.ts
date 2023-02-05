import { empire } from './analyze.fixtures';
import { analyze, isSubset } from 'lib/analyze';

// Subset
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

// test('analyze', () => {
//   console.log(analyze(empire));
// });

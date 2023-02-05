import { empire } from './analyze.fixtures';
import { createSubset } from 'lib/analyze';

// create subset
// ---------------
test('too small suqads result in an empy set', () => {
  expect(createSubset(['a', 'b'], 2)).toEqual([]);
  expect(createSubset(['a', 'b'], 3)).toEqual([]);
  expect(createSubset([], 1)).toEqual([]);
});

test('create subset, omit 0', () => {
  expect(createSubset(empire[0], 0)).toEqual([empire[0]]);
});

// test('create subset, omit 1', () => {
//   console.log(createSubset(['a', 'b', 'c'], 1));
// });

// Just find all subsets?
// https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript-powerset-of-array

// Test for subset? is is enough to filter the non-subset array and check length afterwards? This would also help with duplicates

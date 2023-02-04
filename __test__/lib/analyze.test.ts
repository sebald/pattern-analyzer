import { empire } from './analyze.fixtures';
import { createSubset } from 'lib/analyze';

// create subset
// ---------------
test('create subset, omit 0', () => {
  expect(createSubset(empire[0], 0)).toEqual(empire[0]);
});

import { empire } from './analyze.fixtures';
import { analyze } from 'lib/analyze';

test('analyze', () => {
  console.log(analyze(empire));
});

// Test for subset? is is enough to filter the non-subset array and check length afterwards? This would also help with duplicates

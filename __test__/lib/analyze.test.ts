import { empire } from './analyze.fixtures';
import { analyze } from 'lib/analyze';

test('analyze', () => {
  console.log(analyze(empire));
});

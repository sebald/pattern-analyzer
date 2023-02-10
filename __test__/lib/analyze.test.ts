import { empire } from './analyze.fixtures';
import { analyze } from 'lib/analyze';

test('analyze', () => {
  expect(analyze(empire).sort((a, b) => b.score - a.score)).toMatchSnapshot();
});

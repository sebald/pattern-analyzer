import { empire } from './analyze.fixtures';
import { analyze } from 'lib/analyze';

test('analyze', () => {
  const result = analyze(empire).sort((a, b) => b.score - a.score);
  expect(result).toMatchSnapshot();
});

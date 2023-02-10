import { empire } from './analyze.fixtures';
import { analyze } from 'lib/analyze';

test('analyze', () => {
  expect(analyze(empire)).toMatchSnapshot();
});

import { factory } from '@/lib/stats/factory';
import { faction } from '@/lib/stats/module';

import { squads } from './squads.fixture';

test('create stats (tournament)', () => {
  const stats = factory([])(squads);
  expect(stats.tournament).toMatchSnapshot();
});

test('create stats (faction)', () => {
  const stats = factory([faction()])(squads);
  console.log(stats);
  expect(stats.faction).toMatchSnapshot();
});

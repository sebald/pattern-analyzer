import { factory } from '@/lib/stats/factory';
import { faction, pilot, squadSizes } from '@/lib/stats/module';

import { squads } from './squads.fixture';

test('create stats (tournament)', () => {
  const stats = factory([])(squads);
  expect(stats.tournament).toMatchSnapshot();
});

test('create stats (faction)', () => {
  const stats = factory([faction()])(squads);
  expect(stats.faction).toMatchSnapshot();
});

test('create stats (squadSizes)', () => {
  const stats = factory([squadSizes()])(squads);
  expect(stats.squadSizes).toMatchSnapshot();
});

test('create stats (pilot)', () => {
  const stats = factory([pilot()])(squads);
  expect(stats.pilot).toMatchSnapshot();
});

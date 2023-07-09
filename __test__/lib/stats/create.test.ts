import { create } from '@/lib/stats/create';

import { squads } from './squads.fixture';

test('create stats (tournament)', () => {
  const stats = create([squads]);
  expect(stats.tournament).toMatchSnapshot();
});

test('create stats (squadSizes)', () => {
  const stats = create([squads]);
  expect(stats.squadSizes).toMatchSnapshot();
});

test('create stats (faction)', () => {
  const stats = create([squads]);
  expect(stats.faction).toMatchSnapshot();
});

test('create stats (pilot)', () => {
  const stats = create([squads]);
  expect(stats.pilot).toMatchSnapshot();
});

test('create stats (pilotCostDistribution)', () => {
  const stats = create([squads]);
  expect(stats.pilotCostDistribution).toMatchSnapshot();
});

test('create stats (pilotSkillDistribution)', () => {
  const stats = create([squads]);
  expect(stats.pilotSkillDistribution).toMatchSnapshot();
});

test('create stats (ship)', () => {
  const stats = create([squads]);
  expect(stats.ship).toMatchSnapshot();
});

test('create stats (upgrade)', () => {
  const stats = create([squads]);

  expect(stats.upgrade).toMatchSnapshot();
});

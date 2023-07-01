import { create } from '@/lib/stats/create';

import { squads } from './squads.fixture';
import { result } from './result.fixture';

test('create stats (tournament)', () => {
  const stats = create([squads]);
  expect(stats.tournament).toEqual(result.tournament);
});

test('create stats (squadSizes)', () => {
  const stats = create([squads]);
  expect(stats.squadSizes).toEqual(result.squadSizes);
});

test('create stats (faction)', () => {
  const stats = create([squads]);
  expect(stats.faction).toEqual(result.faction);
});

test('create stats (pilot)', () => {
  const stats = create([squads]);
  expect(stats.pilot).toEqual(result.pilot);
});

test('create stats (pilotCostDistribution)', () => {
  const stats = create([squads]);
  expect(stats.pilotCostDistribution).toEqual(result.pilotCostDistribution);
});

test('create stats (pilotSkillDistribution)', () => {
  const stats = create([squads]);
  expect(stats.pilotSkillDistribution).toEqual(result.pilotSkillDistribution);
});

test('create stats (ship)', () => {
  const stats = create([squads]);
  expect(stats.ship).toEqual(result.ship);
});

// Can not tests maps and JONS ... whoopsie
// test('create stats (shipComposition)', () => {
//   const stats = create([squads]);
//   expect(stats.shipComposition).toEqual(result.shipComposition);
// });

test('create stats (upgrade)', () => {
  const stats = create([squads]);

  expect(stats.upgrade).toEqual(result.upgrade);
});

import { create } from '@/lib/stats/create';

import { squads } from './squads.fixture';
import { result } from './result.fixture';

test('create stats (tournament)', () => {
  const stats = create([squads]);
  expect(stats.tournament).toEqual(result.tournament);
});

test('create stats (faction)', () => {
  const stats = create([squads]);
  expect(stats.faction).toEqual(result.faction);
});

test('create stats (pilot)', () => {
  const stats = create([squads]);
  expect(stats.pilot).toEqual(result.pilot);
});

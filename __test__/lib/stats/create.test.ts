import { create } from '@/lib/stats/create';

import { squads } from './squads.fixture';
import { result } from './result.fixture';

test('create stats', () => {
  const stats = create([squads]);
  expect(stats.tournament).toEqual(result.tournament);

  console.log(stats.faction);
});

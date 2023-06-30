import type { SquadData, XWSFaction } from '@/lib/types';
import {
  average,
  deviation,
  percentile,
  winrate,
} from '@/lib/utils/math.utils';

import { collect } from './collect';
import { initStats } from './init';

export const create = (list: SquadData[][]) => {
  const result = initStats();

  /**
   * Temporariy store values that need to be
   * calculated over all tournaments
   */
  const percentiles = new Map<string, number[]>();

  list.forEach(squads => {
    const current = collect(squads);

    result.tournament.xws += current.tournament.xws;
    result.tournament.count += current.tournament.count;
    result.tournament.cut += current.tournament.cut;

    Object.keys(result.faction).forEach(key => {
      const fid = key as XWSFaction | 'unknown';
      const ranks = current.faction[fid].ranks;

      result.faction[fid].count += current.faction[fid].count;
      result.faction[fid].records.push(...current.faction[fid].records);
      result.faction[fid].ranks.push(...ranks);

      percentiles.set(fid, [
        ...(percentiles.get(fid) || []),
        ...ranks.map(rank => percentile(rank, current.tournament.count)),
      ]);
    });
  });

  // Calculate percentile and deviation for factions
  Object.keys(result.faction).forEach(key => {
    const fid = key as XWSFaction | 'unknown';
    const faction = result.faction[fid];
    const pcs = percentiles.get(fid) || [];

    faction.percentile = average(pcs, 4);
    faction.deviation = deviation(pcs, 4);
    faction.winrate = winrate(faction.records);
  });

  return result;
};

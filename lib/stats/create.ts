import type { SquadData, XWSFaction } from '@/lib/types';

import { collect } from './collect';

export const create = (list: SquadData[][]) => {
  // Internal data storage
  const data = {
    xws: 0,
    count: 0,
    cut: 0,
  };

  list.forEach(squads => {
    const stats = collect(squads);

    tournament.xws += stats.tournament.xws;
    tournament.count += stats.tournament.count;
    tournament.cut += stats.tournament.cut;

    Object.keys(faction).forEach(key => {
      const fid = key as XWSFaction | 'unknown';
      faction[fid].count += stats.faction[fid].count;
      faction[fid].records.push(...stats.faction[fid].records);
      faction[fid].ranks.push(...stats.faction[fid].ranks);
    });
  });

  // Calculate percentile and deviation for factions
  Object.keys(result.faction).forEach(key => {
    const faction = result.faction[key as XWSFaction | 'unknown'];
    const ranks = faction.ranks;

    const pcs = ranks.map(rank => percentile(rank, tournamentStats.count));

    faction.percentile = average(pcs, 4);
    faction.deviation = deviation(pcs, 4);
    faction.winrate = winrate(faction.records);
  });

  return result;
};

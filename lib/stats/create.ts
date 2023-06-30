import { Ships } from '@/lib/get-value';
import type { SquadData, XWSFaction } from '@/lib/types';
import {
  average,
  deviation,
  percentile,
  round,
  winrate,
} from '@/lib/utils/math.utils';

import { collect } from './collect';
import { initPilotStats, initShipSats, initStats } from './init';

export const create = (list: SquadData[][]) => {
  const result = initStats();

  /**
   * Temporariy store values that need to be
   * calculated over all tournaments
   */
  const factionPercentiles = new Map<string, number[]>();
  const pilotPercentiles = new Map<string, number[]>();

  list.forEach(squads => {
    const current = collect(squads);

    // Tournament
    result.tournament.xws += current.tournament.xws;
    result.tournament.count += current.tournament.count;
    result.tournament.cut += current.tournament.cut;

    // Squad Sizes
    Object.keys(current.squadSizes).forEach(key => {
      // @ts-ignore
      result.squadSizes[key] += current.squadSizes[key];
    });

    // Faction
    Object.keys(result.faction).forEach(key => {
      const fid = key as XWSFaction | 'unknown';
      const ranks = current.faction[fid].ranks;

      result.faction[fid].count += current.faction[fid].count;
      result.faction[fid].records.push(...current.faction[fid].records);
      result.faction[fid].ranks.push(...ranks);

      factionPercentiles.set(fid, [
        ...(factionPercentiles.get(fid) || []),
        ...ranks.map(rank => percentile(rank, current.tournament.count)),
      ]);
    });

    // Pilot
    Object.keys(current.pilot).forEach(key => {
      const fid = key as XWSFaction;

      Object.entries(current.pilot[fid]).forEach(([pid, stats]) => {
        if (!stats) return;

        const pilot = result.pilot[fid][pid] || initPilotStats(stats.ship);
        pilot.count += stats.count;
        pilot.lists += stats.lists;
        pilot.records.push(...stats.records);
        pilot.ranks.push(...stats.ranks);

        result.pilot[fid][pid] = pilot;

        pilotPercentiles.set(pid, [
          ...(pilotPercentiles.get(pid) || []),
          ...stats.ranks.map(rank =>
            percentile(rank, current.tournament.count)
          ),
        ]);
      });
    });

    // Pilot Cost
    Object.keys(current.pilotCostDistribution).forEach(key => {
      // @ts-ignore
      result.pilotCostDistribution[key] += current.pilotCostDistribution[key];
    });

    // Pilot Skill
    Object.keys(current.pilotSkillDistribution).forEach(key => {
      // @ts-ignore
      result.pilotSkillDistribution[key] += current.pilotSkillDistribution[key];
    });

    // Ship
    Object.keys(current.ship).forEach(key => {
      const fid = key as XWSFaction;

      Object.entries(current.ship[fid]).forEach(([sid, stats]) => {
        if (!stats) return;

        const ship = result.ship[fid][sid as Ships] || initShipSats();
        ship.count += stats.count;
        ship.lists += stats.lists;

        result.ship[fid][sid as Ships] = ship;
      });
    });
  });

  // Calculate percentile, deviation and winrate for factions
  Object.keys(result.faction).forEach(key => {
    const fid = key as XWSFaction | 'unknown';
    const faction = result.faction[fid];
    const pcs = factionPercentiles.get(fid)!;

    faction.percentile = average(pcs, 4);
    faction.deviation = deviation(pcs, 4);
    faction.winrate = winrate(faction.records);
  });

  // Calculate percentile, deviation, winrate and frequency for pilots
  Object.keys(result.pilot).forEach(key => {
    const fid = key as XWSFaction;

    Object.entries(result.pilot[fid]).forEach(([pid, stats]) => {
      if (!stats) return;

      const pcs = pilotPercentiles.get(pid)!;

      stats.frequency = round(stats.lists / result.faction[fid].count, 4);
      stats.winrate = winrate(stats.records);
      stats.percentile = average(pcs, 4);
      stats.deviation = deviation(pcs, 4);
    });
  });

  // Calculate frequemcy for ships
  Object.keys(result.ship).forEach(key => {
    const fid = key as XWSFaction;

    Object.entries(result.ship[fid]).forEach(([_, stats]) => {
      if (!stats) return;

      stats.frequency = round(stats.lists / result.faction[fid].count, 4);
    });
  });

  return result;
};

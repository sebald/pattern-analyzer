import type { Ships } from '@/lib/get-value';
import type { SquadData, XWSFaction, XWSUpgradeSlots } from '@/lib/types';
import { percentile, average, deviation, winrate, round } from '@/lib/utils';

import {
  FactionMap,
  FactionStatData,
  PilotStatData,
  ShipStatData,
  UpgradeData,
} from './types';

// Helper
// ---------------
const initFactionData = (): FactionStatData => ({
  count: 0,
  records: [],
  ranks: [],
  percentile: 0,
  deviation: 0,
  winrate: 0,
});

// Hook
// ---------------
export interface UseSquadStatsProps {
  squads: SquadData[];
}

export const useSquadStats = ({ squads }: UseSquadStatsProps) => {
  const tournamentStats = {
    xws: 0,
    count: squads.length,
    cut: 0,
  };

  // Stats about factions (ranks, number of squads, ...)
  const factionStats: { [Faction in XWSFaction | 'unknown']: FactionStatData } =
    {
      rebelalliance: initFactionData(),
      galacticempire: initFactionData(),
      scumandvillainy: initFactionData(),
      resistance: initFactionData(),
      firstorder: initFactionData(),
      galacticrepublic: initFactionData(),
      separatistalliance: initFactionData(),
      unknown: initFactionData(),
    };

  // Number of ships per squads
  const squadSizes = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  // Stats about pilots (performance, percentile, number of occurances)
  const pilotStats = {
    rebelalliance: new Map<string, PilotStatData>(),
    galacticempire: new Map<string, PilotStatData>(),
    scumandvillainy: new Map<string, PilotStatData>(),
    resistance: new Map<string, PilotStatData>(),
    firstorder: new Map<string, PilotStatData>(),
    galacticrepublic: new Map<string, PilotStatData>(),
    separatistalliance: new Map<string, PilotStatData>(),
  };

  // Number of pilots per cost
  const pilotCostDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  // Number of squads with the same ships (key = ship ids separated by "|")
  const shipComposition = new Map<string, number>();

  // Ship stats
  const shipStats: FactionMap<Ships, ShipStatData> = {
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  };

  // Upgrades stats
  const upgradeStats = {
    all: new Map<string, UpgradeData>(),
    rebelalliance: new Map<string, UpgradeData>(),
    galacticempire: new Map<string, UpgradeData>(),
    scumandvillainy: new Map<string, UpgradeData>(),
    resistance: new Map<string, UpgradeData>(),
    firstorder: new Map<string, UpgradeData>(),
    galacticrepublic: new Map<string, UpgradeData>(),
    separatistalliance: new Map<string, UpgradeData>(),
  };

  squads.forEach(squad => {
    // Number of Squads with XWS
    if (squad.xws) {
      tournamentStats.xws += 1;
    }

    const faction = squad.xws ? squad.xws.faction : 'unknown';

    // Faction Stats
    const rank = squad.rank;
    factionStats[faction].count += 1;
    factionStats[faction].ranks.push(rank.elimination ?? rank.swiss);
    factionStats[faction].records.push(squad.record);
    if (rank.elimination) {
      tournamentStats.cut += 1;
    }

    // Squad Size
    if (squad.xws) {
      const numPilots = squad.xws.pilots.length as 3 | 4 | 5 | 6 | 7 | 8;
      squadSizes[numPilots] = squadSizes[numPilots] + 1;
    }

    if (squad.xws && faction !== 'unknown') {
      // Use to store ships of the squad
      const ships: Ships[] = [];
      // Use to filter duplicated pilots (a.k.a. generics) and upgrades
      const unique = new Set<string>();

      squad.xws.pilots.forEach(pilot => {
        // Add ship
        ships.push(pilot.ship);

        // Pilot stats
        const pilotInfo = pilotStats[faction].get(pilot.id) || {
          count: 0,
          lists: 0,
          ship: pilot.ship,
          records: [],
          ranks: [],
          // Will be calculated at the end
          frequency: 0,
          winrate: 0,
          percentile: 0,
          deviation: 0,
        };
        pilotStats[faction].set(pilot.id, {
          ...pilotInfo,
          lists: unique.has(pilot.id) ? pilotInfo.lists : pilotInfo.lists + 1,
          count: pilotInfo.count + 1,
          records: [...pilotInfo.records, squad.record],
          ranks: [
            ...pilotInfo.ranks,
            squad.rank.elimination ?? squad.rank.swiss,
          ],
        });

        // Pilot cost distribution
        const points = pilot.points as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        pilotCostDistribution[points] = pilotCostDistribution[points] + 1;

        unique.add(pilot.id);

        // Ship stats
        const shipInfo = shipStats[faction][pilot.ship] || {
          frequency: 0,
          count: 0,
          lists: 0,
        };
        shipStats[faction][pilot.ship] = {
          ...shipInfo,
          count: shipInfo.count + 1,
          lists: unique.has(pilot.ship) ? shipInfo.lists : shipInfo.lists + 1,
        };

        unique.add(pilot.ship);

        // Upgrades stats
        (
          Object.entries(pilot.upgrades) as [XWSUpgradeSlots, string[]][]
        ).forEach(([slot, us]) => {
          us.forEach(u => {
            // Stats overall
            let upgradeInfo = upgradeStats['all'].get(u) || {
              slot,
              count: 0,
              lists: 0,
              records: [],
              ranks: [],
              // Will be calculated at the end
              frequency: 0,
              winrate: 0,
              percentile: 0,
              deviation: 0,
            };
            upgradeStats['all'].set(u, {
              ...upgradeInfo,
              count: upgradeInfo.count + 1,
              lists: unique.has(u) ? upgradeInfo.lists : upgradeInfo.lists + 1,
              records: [...upgradeInfo.records, squad.record],
              ranks: [
                ...upgradeInfo.ranks,
                squad.rank.elimination ?? squad.rank.swiss,
              ],
            });

            // Stats per faction
            upgradeInfo = upgradeStats[faction].get(u) || {
              slot,
              count: 0,
              lists: 0,
              records: [],
              ranks: [],
              // Will be calculated at the end
              frequency: 0,
              winrate: 0,
              percentile: 0,
              deviation: 0,
            };
            upgradeStats[faction].set(u, {
              ...upgradeInfo,
              count: upgradeInfo.count + 1,
              lists: unique.has(u) ? upgradeInfo.lists : upgradeInfo.lists + 1,
              records: [...upgradeInfo.records, squad.record],
              ranks: [
                ...upgradeInfo.ranks,
                squad.rank.elimination ?? squad.rank.swiss,
              ],
            });

            // Add upgrade to unique list so we now we added it to the "lists" field
            unique.add(u);
          });
        });
      });

      // Sort so we can generate an ID
      ships.sort();
      const shipCompositionId = ships.join('|');
      const shipCompositionCount = shipComposition.get(shipCompositionId) || 0;
      shipComposition.set(shipCompositionId, shipCompositionCount + 1);
    }
  });

  // Calculate percentile and deviation for factions
  Object.keys(factionStats).forEach(key => {
    const faction = factionStats[key as XWSFaction | 'unknown'];
    const ranks = faction.ranks;

    const pcs = ranks.map(rank => percentile(rank, tournamentStats.count));

    faction.percentile = average(pcs, 4);
    faction.deviation = deviation(pcs, 4);
    faction.winrate = winrate(faction.records);
  });

  // Calculate performance and average percentile for pilots
  Object.keys(pilotStats).forEach(key => {
    const faction = key as XWSFaction;
    const stats = pilotStats[faction];

    stats.forEach((stat, pilot) => {
      const pcs = stat.ranks.map(rank =>
        percentile(rank, tournamentStats.count)
      );

      stat.frequency = round(stat.lists / factionStats[faction].count, 4);
      stat.winrate = winrate(stat.records);
      stat.percentile = average(pcs, 4);
      stat.deviation = deviation(pcs, 4);

      stats.set(pilot, stat);
    });
  });

  // Calculate frequemcy for ships
  Object.keys(shipStats).forEach(key => {
    const faction = key as XWSFaction;
    const stats = shipStats[faction];

    Object.entries(stats).forEach(([ship, stat]) => {
      stat.frequency = round(stat.lists / factionStats[faction].count, 4);
      stats[ship as Ships] = stat;
    });
  });

  // Calculate performance and average percentile for upgrades
  Object.keys(upgradeStats).forEach(k => {
    const faction = k as keyof typeof upgradeStats;
    const stats = upgradeStats[faction];

    stats.forEach((stat, upgrade) => {
      const pcs = stat.ranks.map(rank =>
        percentile(rank, tournamentStats.count)
      );
      const total =
        faction === 'all' ? tournamentStats.xws : factionStats[faction].count;

      stat.frequency = round(stat.lists / total, 4);
      stat.winrate = winrate(stat.records);
      stat.percentile = average(pcs, 4);
      stat.deviation = deviation(pcs, 4);

      stats.set(upgrade, stat);
    });
  });

  return {
    tournamentStats,
    factionStats,
    squadSizes,
    pilotStats,
    pilotCostDistribution,
    shipComposition,
    shipStats,
    upgradeStats,
  };
};

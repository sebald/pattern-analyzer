'use client';

import { Link, Message } from '@/components';
import type { Ships } from '@/lib/get-value';
import type { SquadData, XWSFaction, XWSUpgradeSlots } from '@/lib/types';
import { average, deviation, percentile, winrate, round } from '@/lib/utils';

import type { PilotStatData, UpgradeData } from './charts/shared';
import { FactionDistribution } from './charts/faction-distribution';
import { FactionPerformance } from './charts/faction-performance';
import { PilotCostDistribution } from './charts/pilot-cost-distribution';
import { PilotStats } from './charts/pilot-stats';
import { ShipComposition } from './charts/ship-composition';
import { SquadSize } from './charts/squad-size';
import { UpgradeSummary } from './charts/upgrade-summary';
import { UpgradeStats } from './charts/upgrade-stats';

// Hook
// ---------------
export interface UseSquadStatsProps {
  squads: SquadData[];
}

const useSquadStats = ({ squads }: UseSquadStatsProps) => {
  const numberOfSquads = {
    xws: 0,
    total: squads.length,
  };

  // Number of squads per faction
  const factionDistribution = {
    rebelalliance: 0,
    galacticempire: 0,
    scumandvillainy: 0,
    resistance: 0,
    firstorder: 0,
    galacticrepublic: 0,
    separatistalliance: 0,
    unknown: 0,
  };

  // Ranks per factions + percentiles
  const factionRankings: { [Faction in XWSFaction | 'unknown']: number[] } = {
    rebelalliance: [],
    galacticempire: [],
    scumandvillainy: [],
    resistance: [],
    firstorder: [],
    galacticrepublic: [],
    separatistalliance: [],
    unknown: [],
  };
  const factionPerformance = {
    rebelalliance: { percentile: 0, deviation: 0 },
    galacticempire: { percentile: 0, deviation: 0 },
    scumandvillainy: { percentile: 0, deviation: 0 },
    resistance: { percentile: 0, deviation: 0 },
    firstorder: { percentile: 0, deviation: 0 },
    galacticrepublic: { percentile: 0, deviation: 0 },
    separatistalliance: { percentile: 0, deviation: 0 },
    unknown: { percentile: 0, deviation: 0 },
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
      numberOfSquads.xws = numberOfSquads.xws + 1;
    }

    // Faction Distribution
    const faction = squad.xws ? squad.xws.faction : 'unknown';
    factionDistribution[faction] = factionDistribution[faction] + 1;

    // Faction Rank
    factionRankings[faction].push(squad.rank.elimination ?? squad.rank.swiss);

    // Squad Size
    if (squad.xws) {
      const numPilots = squad.xws.pilots.length as 3 | 4 | 5 | 6 | 7 | 8;
      squadSizes[numPilots] = squadSizes[numPilots] + 1;
    }

    if (squad.xws && faction !== 'unknown') {
      // Use to store ships of the squad
      const ships: Ships[] = [];
      // Use to filter duplicated pilots (a.k.a. generics) and upgrades
      const unique: string[] = [];

      squad.xws.pilots.forEach(pilot => {
        // Add ship
        ships.push(pilot.ship);

        // Pilot was already added for this list
        if (unique.includes(pilot.id)) {
          // FIXME: Does this mean we don't consider generics that have
          //        different loadouts!?
          return;
        }
        unique.push(pilot.id);

        // Pilot stats
        const pilotInfo = pilotStats[faction].get(pilot.id) || {
          count: 0,
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
              lists: unique.includes(u)
                ? upgradeInfo.lists
                : upgradeInfo.lists + 1,
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
              lists: unique.includes(u)
                ? upgradeInfo.lists
                : upgradeInfo.lists + 1,
              records: [...upgradeInfo.records, squad.record],
              ranks: [
                ...upgradeInfo.ranks,
                squad.rank.elimination ?? squad.rank.swiss,
              ],
            });

            // Add upgrade to unique list so we now we added it to the "lists" field
            unique.push(u);
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
  Object.keys(factionRankings).forEach(key => {
    const faction = key as XWSFaction | 'unknown';
    const ranks = factionRankings[faction];

    const pcs = ranks.map(rank => percentile(rank, numberOfSquads.total));

    factionPerformance[faction] = {
      percentile: average(pcs, 4),
      deviation: deviation(pcs, 4),
    };
  });

  // Calculate performance and average percentile for pilots
  Object.keys(pilotStats).forEach(key => {
    const faction = key as XWSFaction;
    const stats = pilotStats[faction];

    stats.forEach((stat, pilot) => {
      const pcs = stat.ranks.map(rank =>
        percentile(rank, numberOfSquads.total)
      );

      stat.frequency = round(stat.count / factionDistribution[faction], 4);
      stat.winrate = winrate(stat.records);
      stat.percentile = average(pcs, 4);
      stat.deviation = deviation(pcs, 4);

      stats.set(pilot, stat);
    });
  });

  // Calculate performance and average percentile for upgrades
  Object.keys(upgradeStats).forEach(k => {
    const key = k as keyof typeof upgradeStats;
    const stats = upgradeStats[key];

    stats.forEach((stat, upgrade) => {
      const pcs = stat.ranks.map(rank =>
        percentile(rank, numberOfSquads.total)
      );
      const total =
        key === 'all' ? numberOfSquads.xws : factionDistribution[key];

      stat.frequency = round(stat.lists / total, 4);
      stat.winrate = winrate(stat.records);
      stat.percentile = average(pcs, 4);
      stat.deviation = deviation(pcs, 4);

      stats.set(upgrade, stat);
    });
  });

  return {
    numberOfSquads,
    factionDistribution,
    factionPerformance,
    squadSizes,
    pilotStats,
    pilotCostDistribution,
    shipComposition,
    upgradeStats,
  };
};

// Props
// ---------------
export interface StatsProps {
  squads: SquadData[];
}

// Component
// ---------------
export const Stats = ({ squads }: StatsProps) => {
  const data = useSquadStats({ squads });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-6">
        <FactionDistribution
          value={data.factionDistribution}
          total={data.numberOfSquads.total}
        />
      </div>
      <div className="md:col-span-6">
        <FactionPerformance value={data.factionPerformance} />
      </div>
      <div className="md:col-span-5">
        <SquadSize value={data.squadSizes} total={data.numberOfSquads.xws} />
      </div>
      <div className="md:col-span-7">
        <PilotCostDistribution value={data.pilotCostDistribution} />
      </div>
      <div className="col-span-full">
        <PilotStats value={data.pilotStats} />
      </div>
      <div className="col-span-full">
        <UpgradeStats value={data.upgradeStats} />
      </div>
      <div className="md:col-span-6 lg:col-span-4">
        <UpgradeSummary value={data.upgradeStats} />
      </div>
      <div className="self-start md:col-span-6 lg:col-span-8">
        <ShipComposition
          value={data.shipComposition}
          total={data.numberOfSquads.xws}
        />
      </div>
      <div className="col-span-full lg:col-start-2 lg:col-end-11">
        <Message align="center">
          <Message.Title>
            For information about some commonly used terms, see the &quot;About
            the Data&quot; secion on the{' '}
            <Link className="underline underline-offset-2" href="/about">
              About
            </Link>{' '}
            page.
          </Message.Title>
        </Message>
      </div>
    </div>
  );
};

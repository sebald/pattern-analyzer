'use client';

import type { Ships } from 'lib/get-value';
import type { SquadData, XWSUpgradeSlots } from 'lib/types';
import { FactionDistribution } from './charts/faction-distribution';
import { PilotCostDistribution } from './charts/pilot-cost-distribution';
import { PilotFrequency } from './charts/pilot-frequency';
import { ShipComposition } from './charts/ship-composition';
import { SquadSize } from './charts/squad-size';
import { UpgradeSummary } from './charts/upgrade-summary';

// Hook
// ---------------
export interface UseSquadStatsProps {
  squads: SquadData[];
}

export interface UpgradeInfo {
  slot: XWSUpgradeSlots;
  count: number;
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

  // Number of ships per squads
  const squadSizes = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  // How often is a certain pilot included in a list (per faction)
  const pilotFrequency = {
    rebelalliance: new Map<string, { count: number; ship: Ships }>(),
    galacticempire: new Map<string, { count: number; ship: Ships }>(),
    scumandvillainy: new Map<string, { count: number; ship: Ships }>(),
    resistance: new Map<string, { count: number; ship: Ships }>(),
    firstorder: new Map<string, { count: number; ship: Ships }>(),
    galacticrepublic: new Map<string, { count: number; ship: Ships }>(),
    separatistalliance: new Map<string, { count: number; ship: Ships }>(),
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

  // Upgrades summary
  const upgradeSummary = {
    all: new Map<string, UpgradeInfo>(),
    rebelalliance: new Map<string, UpgradeInfo>(),
    galacticempire: new Map<string, UpgradeInfo>(),
    scumandvillainy: new Map<string, UpgradeInfo>(),
    resistance: new Map<string, UpgradeInfo>(),
    firstorder: new Map<string, UpgradeInfo>(),
    galacticrepublic: new Map<string, UpgradeInfo>(),
    separatistalliance: new Map<string, UpgradeInfo>(),
  };

  squads.forEach(squad => {
    // Number of Squads with XWS
    if (squad.xws) {
      numberOfSquads.xws = numberOfSquads.xws + 1;
    }

    // Faction Distribution
    const faction = squad.xws ? squad.xws.faction : 'unknown';
    factionDistribution[faction] = factionDistribution[faction] + 1;

    // Squad Size
    if (squad.xws) {
      const numPilots = squad.xws.pilots.length as 3 | 4 | 5 | 6 | 7 | 8;
      squadSizes[numPilots] = squadSizes[numPilots] + 1;
    }

    if (squad.xws && faction !== 'unknown') {
      // Use to store ships of the squad
      const ships: Ships[] = [];
      // Use to filter duplicated pilots (a.k.a. generics)
      const unique: string[] = [];

      squad.xws.pilots.forEach(pilot => {
        // Add ship
        ships.push(pilot.ship);

        // Pilot was already added for this list
        if (unique.includes(pilot.id)) {
          return;
        }
        unique.push(pilot.id);

        // Frequency of included pilot (separated by faction)
        const pilotInfo = pilotFrequency[faction].get(pilot.id) || {
          count: 0,
          ship: pilot.ship,
        };
        pilotFrequency[faction].set(pilot.id, {
          count: pilotInfo.count + 1,
          ship: pilotInfo.ship,
        });

        // Pilot cost distribution
        const points = pilot.points as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        pilotCostDistribution[points] = pilotCostDistribution[points] + 1;

        // Upgrades summary
        (
          Object.entries(pilot.upgrades) as [XWSUpgradeSlots, string[]][]
        ).forEach(([slot, us]) => {
          us.forEach(u => {
            let upgradeInfo = upgradeSummary['all'].get(u) || {
              slot,
              count: 0,
            };
            upgradeInfo.count = upgradeInfo.count + 1;
            upgradeSummary['all'].set(u, upgradeInfo);

            upgradeInfo = upgradeSummary[faction].get(u) || {
              slot,
              count: 0,
            };
            upgradeInfo.count = upgradeInfo.count + 1;
            upgradeSummary[faction].set(u, upgradeInfo);
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

  return {
    numberOfSquads,
    factionDistribution,
    squadSizes,
    pilotFrequency,
    pilotCostDistribution,
    shipComposition,
    upgradeSummary,
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
        <SquadSize value={data.squadSizes} total={data.numberOfSquads.xws} />
      </div>
      <div className="md:col-span-6 lg:col-span-4">
        <PilotFrequency
          value={data.pilotFrequency}
          distribution={data.factionDistribution}
        />
      </div>
      <div className="md:col-span-6 lg:col-span-8">
        <div className="flex flex-col gap-4">
          <PilotCostDistribution value={data.pilotCostDistribution} />
          <ShipComposition
            value={data.shipComposition}
            total={data.numberOfSquads.xws}
          />
        </div>
      </div>
      <div className="md:col-span-6 lg:col-span-4">
        <UpgradeSummary value={data.upgradeSummary} />
      </div>
    </div>
  );
};

// grid-cols-12 6,6,4

'use client';

import type { Ships } from 'lib/get-value';
import type { SquadsData } from 'lib/types';
import { FactionDistribution } from './charts/faction-distribution';
import { PilotFrequency } from './charts/pilot-frequency';
import { SquadSize } from './charts/squad-size';

// Hook
// ---------------
export interface UseSquadStatsProps {
  squads: SquadsData[];
}

const useSquadStats = ({ squads }: UseSquadStatsProps) => {
  const numberOfSquads = {
    xws: 0,
    total: squads.length,
  };

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

  const squadSizes = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  const pilotFrequency = {
    rebelalliance: new Map<string, { count: number; ship: Ships }>(),
    galacticempire: new Map<string, { count: number; ship: Ships }>(),
    scumandvillainy: new Map<string, { count: number; ship: Ships }>(),
    resistance: new Map<string, { count: number; ship: Ships }>(),
    firstorder: new Map<string, { count: number; ship: Ships }>(),
    galacticrepublic: new Map<string, { count: number; ship: Ships }>(),
    separatistalliance: new Map<string, { count: number; ship: Ships }>(),
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

    // Frequency of included pilot (separated by faction)
    if (squad.xws && faction !== 'unknown') {
      const current: string[] = [];
      squad.xws.pilots.forEach(pilot => {
        // Pilot was already added for this list
        if (current.includes(pilot.id)) {
          return;
        }
        current.push(pilot.id);

        const { count, ship } = pilotFrequency[faction].get(pilot.id) || {
          count: 0,
          ship: pilot.ship,
        };
        pilotFrequency[faction].set(pilot.id, { count: count + 1, ship });
      });
      faction;
    }
  });

  return { numberOfSquads, factionDistribution, squadSizes, pilotFrequency };
};

// Props
// ---------------
export interface StatsProps {
  squads: SquadsData[];
}

// Component
// ---------------
export const Stats = ({ squads }: StatsProps) => {
  const data = useSquadStats({ squads });
  console.log(data.pilotFrequency);
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <FactionDistribution
          value={data.factionDistribution}
          total={data.numberOfSquads.total}
        />
      </div>
      <div className="col-span-6">
        <SquadSize value={data.squadSizes} total={data.numberOfSquads.xws} />
      </div>
      <div className="col-span-4">
        <PilotFrequency
          value={data.pilotFrequency}
          distribution={data.factionDistribution}
        />
      </div>
    </div>
  );
};

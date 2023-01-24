'use client';

import { SquadsData, XWSFaction } from 'lib/types';
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
    rebelalliance: new Map<string, number>(),
    galacticempire: new Map<string, number>(),
    scumandvillainy: new Map<string, number>(),
    resistance: new Map<string, number>(),
    firstorder: new Map<string, number>(),
    galacticrepublic: new Map<string, number>(),
    separatistalliance: new Map<string, number>(),
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
      squad.xws.pilots.forEach(({ id }) => {
        // Pilot was already added for this list
        if (current.includes(id)) {
          return;
        }
        current.push(id);

        const count = pilotFrequency[faction].get(id) || 0;
        pilotFrequency[faction].set(id, count + 1);
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
    <div className="flex flex-col gap-4">
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,_minmax(min(400px,_100%),_1fr))] gap-4">
        <FactionDistribution
          value={data.factionDistribution}
          total={data.numberOfSquads.total}
        />
        <SquadSize value={data.squadSizes} total={data.numberOfSquads.xws} />
      </div>
      <div>
        <PilotFrequency value={data.pilotFrequency} />
      </div>
    </div>
  );
};

'use client';

import { SquadsData } from 'lib/types';
import { FactionDistribution } from './charts/faction-distribution';
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

  squads.forEach(squad => {
    // Number of Squads with XWS
    if (squad.xws) {
      numberOfSquads.xws = numberOfSquads.xws + 1;
    }

    // Faction Distribution
    const faction = squad.xws ? squad.xws.faction : 'unknown';
    factionDistribution[faction] = factionDistribution[faction] + 1;

    // Squad Size
  });

  return { numberOfSquads, factionDistribution };
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

  return (
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,_minmax(min(350px,_100%),_1fr))] gap-4">
      <FactionDistribution
        value={data.factionDistribution}
        total={data.numberOfSquads.total}
      />
      <SquadSize />
    </div>
  );
};

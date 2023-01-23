'use client';

import { SquadsData } from 'lib/types';

import { FactionDoughnut } from './charts';

// Hook
// ---------------
export interface UseSquadStatsProps {
  squads: SquadsData[];
}

const useSquadStats = ({ squads }: UseSquadStatsProps) => {
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
    // Faction Distribution
    const faction = squad.xws ? squad.xws.faction : 'unknown';
    factionDistribution[faction] = factionDistribution[faction] + 1;
  });

  return { factionDistribution };
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
    <div className="flex">
      <div className="w-2/5 sm:w-full">
        <FactionDoughnut value={data.factionDistribution} />
      </div>
      <div>hello</div>
    </div>
  );
};

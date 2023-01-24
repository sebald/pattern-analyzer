'use client';

import { SquadsData } from 'lib/types';
import { FactionDistribution } from './charts/faction-distribution';

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
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,_minmax(min(350px,_100%),_1fr))] gap-4">
      <FactionDistribution value={data.factionDistribution} />
      <div className="h-72 bg-green-300">asd</div>
    </div>
  );
};

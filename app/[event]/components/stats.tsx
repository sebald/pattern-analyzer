'use client';

import { ResponsivePie } from '@nivo/pie';

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
    <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,_minmax(min(350px,_100%),_1fr))] gap-4">
      <div className="">
        <Nivio />
      </div>
      <div className="h-72 bg-green-300">asd</div>
    </div>
  );
};

{
  /* <div className="w-full md:w-2/5">
<div className="flex">
  <FactionDoughnut value={data.factionDistribution} />
</div>
<div className="h-96">
  <Nivio />
</div>
</div> */
}

const Nivio = () => (
  <ResponsivePie
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    data={[
      {
        id: 'stylus',
        label: 'stylus',
        value: 422,
        color: 'hsl(152, 70%, 50%)',
      },
      {
        id: 'erlang',
        label: 'erlang',
        value: 405,
        color: 'hsl(345, 70%, 50%)',
      },
      {
        id: 'java',
        label: 'java',
        value: 216,
        color: 'hsl(106, 70%, 50%)',
      },
      {
        id: 'php',
        label: 'php',
        value: 165,
        color: 'hsl(236, 70%, 50%)',
      },
      {
        id: 'c',
        label: 'c',
        value: 236,
        color: 'hsl(135, 70%, 50%)',
      },
    ]}
    animate
    activeOuterRadiusOffset={8}
  />
);

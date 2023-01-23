'use client';

import { SquadsData } from 'lib/types';

// Hook
// ---------------
const useSquadStats = ({}) => {};

// Props
// ---------------
export interface StatsProps {
  squads: SquadsData[];
}

// Component
// ---------------
export const Stats = ({ squads }: StatsProps) => {
  const data = useSquadStats({ squads });

  return <div>STAAATS!</div>;
};

'use client';

import { useLongshanksSquads } from '@/lib/useLongshanksSquads';

// Props
// ---------------
export interface LongshanksRankingsProps {
  id: string;
}

// Component
// ---------------
export const LongshanksRankings = ({ id }: LongshanksRankingsProps) => {
  const squads = useLongshanksSquads({ id });

  return 'todo!';
};

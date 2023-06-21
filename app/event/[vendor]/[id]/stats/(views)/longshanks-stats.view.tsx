'use client';

import { useLongshanksSquads } from '@/lib/useLongshanksSquads';
import { Skeleton, Tiles, CardSkeleton } from '@/ui';

import { StatsView } from './stats.view';

// Props
// ---------------
export interface LongshanksStatsViewProps {
  id: string;
}

// View
// ---------------
export const LongshanksStatsView = ({ id }: LongshanksStatsViewProps) => {
  const { squads } = useLongshanksSquads({ id });

  if (!squads) {
    return (
      <Skeleton>
        <Tiles>
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
        </Tiles>
      </Skeleton>
    );
  }

  return <StatsView squads={squads} />;
};

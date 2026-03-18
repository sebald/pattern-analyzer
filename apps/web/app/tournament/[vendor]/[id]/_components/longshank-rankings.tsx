'use client';

import { useLongshanksSquads } from '@/lib/useLongshanksSquads';
import { Skeleton, CardSkeleton } from '@/ui';

import { Rankings } from './rankings';

// Props
// ---------------
export interface LongshanksRankingsProps {
  id: string;
}

// Component
// ---------------
export const LongshanksRankings = ({ id }: LongshanksRankingsProps) => {
  const { squads } = useLongshanksSquads({ id });

  if (!squads) {
    return (
      <Skeleton>
        <div className="grid gap-3">
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
          <CardSkeleton lines={[2, 2, 3]} />
        </div>
      </Skeleton>
    );
  }

  return <Rankings squads={squads} />;
};

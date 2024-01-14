'use client';

import { useLongshanksSquads } from '@/lib/useLongshanksSquads';
import { Skeleton, Tiles, CardSkeleton } from '@/ui';

import { SquadsView } from './squad.view';

// Props
// ---------------
export interface LongshanksSquadViewProps {
  id: string;
}

// View
// ---------------
export const LongshanksSquadView = ({ id }: LongshanksSquadViewProps) => {
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

  return <SquadsView squads={squads} />;
};

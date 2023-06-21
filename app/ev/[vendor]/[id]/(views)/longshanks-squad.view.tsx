'use client';

import { FilterProvider } from './components/context';
import { Filter } from './components/filter';
import { Squads } from './components/squads';

import { useLongshanksSquads } from '@/lib/useLongshanksSquads';
import { Skeleton, Tiles, CardSkeleton } from '@/ui';

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

  return (
    <FilterProvider>
      <Filter />
      <Squads squads={squads} />
    </FilterProvider>
  );
};

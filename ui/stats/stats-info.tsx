import { Suspense } from 'react';

import { getFactionCount } from '@/lib/db/squads';
import { getTournamentsCount } from '@/lib/db/tournaments';
import { formatDate, today } from '@/lib/utils/date.utils';

import { Trophy, Rocket, Calendar } from '@/ui/icons';
import { Inline } from '@/ui/inline';
import { Skeleton, LineSkeleton } from '@/ui/skeleton';

// Props
// ---------------
export interface StatsInfoProps {
  from: Date;
  to?: Date;
}

// Async Content
// ---------------
const AsyncStatsInfo = async ({ from, to }: StatsInfoProps) => {
  const [tournaments, count] = await Promise.all([
    getTournamentsCount({ from, to }),
    getFactionCount({ from, to }),
  ]);

  return (
    <>
      <Inline className="whitespace-nowrap">
        <Trophy className="h-3 w-3" /> {tournaments} Tournaments
      </Inline>
      <Inline className="whitespace-nowrap">
        <Rocket className="h-3 w-3" /> {count.all} Squads
      </Inline>
    </>
  );
};

// Component
// ---------------
export const StatsInfo = ({ from, to }: StatsInfoProps) => {
  return (
    <Inline className="gap-4">
      <Inline className="whitespace-nowrap">
        <Calendar className="h-3 w-3" /> {formatDate(from)} -{' '}
        {formatDate(to || today())}
      </Inline>
      <Suspense
        fallback={
          <Skeleton>
            <Inline className="gap-4">
              <LineSkeleton className="h-3 w-32 bg-primary-200" />
              <LineSkeleton className="h-3 w-24 bg-primary-200" />
            </Inline>
          </Skeleton>
        }
      >
        <AsyncStatsInfo from={from} to={to} />
      </Suspense>
    </Inline>
  );
};

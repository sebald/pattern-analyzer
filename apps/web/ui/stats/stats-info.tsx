import { Suspense } from 'react';

import { getFactionCount } from '@/lib/db/squads';
import { getTournamentsCount } from '@/lib/db/tournaments';
import { formatDate, today } from '@/lib/utils/date.utils';

import { Trophy, Rocket, Calendar, Info } from '@/ui/icons';
import { Inline } from '@/ui/inline';
import { Skeleton, LineSkeleton } from '@/ui/skeleton';

// Props
// ---------------
export interface StatsInfoProps {
  from: Date;
  to?: Date;
  /**
   * Shows a hint that the window was widened because there is not enough data
   * since the last points update yet.
   */
  fallback?: boolean;
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
export const StatsInfo = ({ from, to, fallback }: StatsInfoProps) => {
  return (
    <Inline className="gap-4">
      <Inline className="whitespace-nowrap">
        <Calendar className="size-3" /> {formatDate(from)} -{' '}
        {formatDate(to || today())}
      </Inline>
      {fallback ? (
        <Inline className="whitespace-nowrap italic">
          <Info className="size-3" /> Not enough data since the last points
          update
        </Inline>
      ) : null}
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

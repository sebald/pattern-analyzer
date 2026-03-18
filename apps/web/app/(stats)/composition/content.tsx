import { Suspense } from 'react';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getTournamentsCount } from '@/lib/db/tournaments';
import { setup } from '@/lib/stats';
import { CompositionData, composition } from '@/lib/stats/module';

import { StatsHint } from '@/ui/stats/stats-hint';
import { CardTableSkeleton } from '@/ui';

import { Compositions } from './compositions';

// Helpers
// ---------------
const create = setup<CompositionData>([composition]);

// Props
// ---------------
export interface ContentProps {
  from: Date;
  to?: Date;
}

// Content
// ---------------
const AsyncContent = async ({ from, to }: ContentProps) => {
  const [squads, tournaments, count] = await Promise.all([
    getSquads({ from, to }),
    getTournamentsCount({ from, to }),
    getFactionCount({ from, to }),
  ]);
  const stats = create(squads, {
    count,
    tournaments,
  });

  return <Compositions data={stats.composition} />;
};

export const Content = (props: ContentProps) => (
  <Suspense fallback={<CardTableSkeleton />}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="col-span-full">
        <AsyncContent {...props} />
      </div>
      <div className="col-span-full pt-8 lg:col-start-2 lg:col-end-12">
        <StatsHint />
      </div>
    </div>
  </Suspense>
);

import { Suspense } from 'react';

import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getTournamentsCount } from '@/lib/db/tournaments';
import { upgrade, type UpgradeData } from '@/lib/stats/module';
import { setup } from '@/lib/stats/setup';

import { CardTableSkeleton } from '@/ui';
import { StatsHint } from '@/ui/stats/stats-hint';

import { Upgrades } from './upgrades';

// Helpers
// ---------------
const create = setup<UpgradeData>([upgrade]);

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

  return <Upgrades data={stats.upgrade} />;
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

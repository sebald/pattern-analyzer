import { createMetadata } from '@/lib/metadata';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getTournamentsCount } from '@/lib/db/tournaments';
import { formatDate, fromDate, toDate, today } from '@/lib/utils/date.utils';

import {
  Caption,
  CardTableSkeleton,
  Inline,
  LineSkeleton,
  Message,
  Skeleton,
  Title,
} from '@/ui';
import { Calendar, Rocket, Trophy } from '@/ui/icons';

import { StatsHint } from '@/ui/stats/stats-hint';
import { setup } from '@/lib/stats';
import { CompositionData, composition } from '@/lib/stats/module';

import { DateRangeFilter } from '@/ui/params/date-range-filter';
import { FactionFilter } from '@/ui/params/faction-filter';
import { SmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { SortParam } from '@/ui/params/sort-param';

import { Compositions } from './compositions';
import { Suspense } from 'react';
import { toDateRange } from '@/lib/utils/params.utils';
import { Filter } from '@/ui/params/filter';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Compositions',
  description: 'Take a look at what is currently flown in X-Wing!',
  ogTitle: 'Squad Compositions',
  ogWidth: 65,
});

// Helpers
// ---------------
const create = setup<CompositionData>([composition]);

// Data
// ---------------
const getInfo = async (from: Date, to: Date | undefined) => {
  const [tournaments, count] = await Promise.all([
    getTournamentsCount({ from, to }),
    getFactionCount({ from, to }),
  ]);

  return {
    tournaments,
    count,
  };
};

const getStats = async (from: Date, to: Date | undefined) => {
  const [squads, tournaments, count] = await Promise.all([
    getSquads({ from, to }),
    getTournamentsCount({ from, to }),
    getFactionCount({ from, to }),
  ]);

  return create(squads, {
    count,
    tournaments,
  });
};

// Info and Content Blocks
// ---------------
const Info = async ({ from, to }: { from: Date; to?: Date }) => {
  const info = await getInfo(from, to);
  return (
    <>
      <Inline className="whitespace-nowrap">
        <Trophy className="h-3 w-3" /> {info.tournaments} Tournaments
      </Inline>
      <Inline className="whitespace-nowrap">
        <Rocket className="h-3 w-3" /> {info.count.all} Squads
      </Inline>
    </>
  );
};

const Content = async ({ from, to }: { from: Date; to?: Date }) => {
  const stats = await getStats(from, to);
  return <Compositions data={stats.composition} />;
};

// Props
// ---------------
interface PageProps {
  searchParams: {
    from: string;
    to: string;
  };
}

// Page
// ---------------
const CompositionsPage = async ({ searchParams }: PageProps) => {
  const result = toDateRange(searchParams);

  if (result.error) {
    return (
      <div className="grid flex-1 place-items-center">
        <Message variant="error">
          <Message.Title>Whoopsie, something went wrong!</Message.Title>
          Looks like there is an error in the given query parameters.
        </Message>
      </div>
    );
  }

  const { from, to } = result;

  return (
    <>
      <div className="pb-6">
        <Title>Compositions</Title>
        <Caption>
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
              <Info to={to} from={from} />
            </Suspense>
          </Inline>
        </Caption>
      </div>
      <Filter>
        <SmallSamplesFilter />
        <DateRangeFilter />
        <FactionFilter />
        <SortParam />
      </Filter>
      <Suspense fallback={<CardTableSkeleton />}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="col-span-full">
            <Content to={to} from={from} />
          </div>
          <div className="col-span-full pt-8 lg:col-start-2 lg:col-end-12">
            <StatsHint />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default CompositionsPage;

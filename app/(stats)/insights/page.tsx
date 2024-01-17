import { createMetadata } from '@/lib/metadata';
import { toDateRange } from '@/lib/utils/params.utils';

import { Caption, CardChartSkeleton, Message, Title } from '@/ui';
import { Filter } from '@/ui/params/filter';
import { DateRangeFilter } from '@/ui/params/date-range-filter';
import { StatsInfo } from '@/ui/stats/stats-info';

import { Content } from './content';
import { Suspense } from 'react';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Insights',
  description: 'Dive into the current X-Wing meta!',
});

// Helpers
// ---------------
const Loading = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <CardChartSkeleton />
    <CardChartSkeleton />
    <CardChartSkeleton />
    <CardChartSkeleton />
  </div>
);

// Props
// ---------------
interface InsightsPageProps {
  searchParams: {
    from: string;
    to: string;
  };
}

// Page
// ---------------
const InsightsPage = async ({ searchParams }: InsightsPageProps) => {
  const params = toDateRange(searchParams);

  if (params.error) {
    return (
      <div className="grid flex-1 place-items-center">
        <Message variant="error">
          <Message.Title>Whoopsie, something went wrong!</Message.Title>
          Looks like there is an error in the given query parameters.
        </Message>
      </div>
    );
  }

  const { from, to } = params;

  return (
    <>
      <div className="pb-6">
        <Title>Insights</Title>
        <Caption>
          <StatsInfo from={from} to={to} />
        </Caption>
      </div>
      <Filter>
        <DateRangeFilter />
      </Filter>
      <Suspense fallback={<Loading />}>
        <Content from={from} to={to} />
      </Suspense>
    </>
  );
};

export default InsightsPage;

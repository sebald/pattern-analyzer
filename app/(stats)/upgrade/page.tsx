import { createMetadata } from '@/lib/metadata';
import { toDateRange } from '@/lib/utils/params.utils';

import { Caption, Message, Title } from '@/ui';
import { DateRangeFilter } from '@/ui/params/date-range-filter';
import { FactionFilter } from '@/ui/params/faction-filter';
import { Filter } from '@/ui/params/filter';
import { SmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { SortParam } from '@/ui/params/sort-param';
import { StatsInfo } from '@/ui/stats/stats-info';

import { Content } from './content';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Pilots',
  description: 'Find out what is the best upgrade!',
  ogTitle: 'Pilots',
  ogWidth: 65,
});

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
const UpgradesPage = async ({ searchParams }: PageProps) => {
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
        <Title>Upgrades</Title>
        <Caption>
          <StatsInfo from={from} to={to} />
        </Caption>
      </div>
      <Filter>
        <SmallSamplesFilter />
        <DateRangeFilter />
        <FactionFilter />
        <SortParam />
      </Filter>
      <Content from={from} to={to} />
    </>
  );
};

export default UpgradesPage;

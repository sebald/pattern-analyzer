import { createMetadata } from '@/lib/metadata';

import { Caption, Message, Title } from '@/ui';

import { DateRangeFilter } from '@/ui/params/date-range-filter';
import { FactionFilter } from '@/ui/params/faction-filter';
import { SmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { SortParam } from '@/ui/params/sort-param';

import { toDateRange } from '@/lib/utils/params.utils';
import { Filter } from '@/ui/params/filter';
import { StatsInfo } from '@/ui/stats/stats-info';

import { Content } from './content';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Compositions',
  description: 'Take a look at what is currently flown in X-Wing!',
  ogTitle: 'Squad Compositions',
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
const CompositionsPage = async ({ searchParams }: PageProps) => {
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
        <Title>Compositions</Title>
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

export default CompositionsPage;

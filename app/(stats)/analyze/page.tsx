import { createMetadata } from '@/lib/metadata';
import { toDateRange } from '@/lib/utils/params.utils';

import { Caption, Message, Title } from '@/ui';
import { Filter } from '@/ui/params/filter';
import { DateRangeFilter } from '@/ui/params/date-range-filter';
import { StatsInfo } from '@/ui/stats/stats-info';

import { Content } from './content';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Analyze',
  description: 'Analyze the current X-Wing meta!',
});

// Props
// ---------------
interface AnalyzePageProps {
  searchParams: {
    from: string;
    to: string;
    'small-samples': 'show' | 'hide';
  };
}

// Page
// ---------------
const AnalyzePage = async ({ searchParams }: AnalyzePageProps) => {
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
        <Title>Analyze</Title>
        <Caption>
          <StatsInfo from={from} to={to} />
        </Caption>
      </div>
      <Filter>
        <DateRangeFilter />
      </Filter>
      <Content from={from} to={to} />
    </>
  );
};

export default AnalyzePage;

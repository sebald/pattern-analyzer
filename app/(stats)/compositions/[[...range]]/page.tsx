import { pointsUpdateDate } from '@/lib/config';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getTournamentsCount } from '@/lib/db/tournaments';
import { formatDate, fromDate, toDate, today } from '@/lib/utils/date.utils';
import { toRange } from '@/lib/utils/url.utils';

import { Caption, Card, Inline, Message, Title } from '@/ui';
import { Calendar, Rocket, Trophy } from '@/ui/icons';

import {
  CompositionFilter,
  CompositionFilterProvider,
  CompositionTable,
} from '@/ui/stats/composition-stats';
import { StatsFilter } from '@/ui/stats/stats-filter';
import { createMetadata } from '@/lib/metadata';
import { StatsHint } from '@/ui/stats/stats-hint';
import { setup } from '@/lib/stats';
import { CompositionData, composition } from '@/lib/stats/module';
import { QueryFilter } from '@/ui/filter/query-filter';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 21600; // 6 hours

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
const getStats = async (from: Date, to: Date | undefined) => {
  const [squads, tournaments, count] = await Promise.all([
    getSquads({ from, to }),
    getTournamentsCount({ from, to }),
    getFactionCount({ from, to }),
  ]);

  return {
    stats: create(squads, {
      count,
      tournaments,
    }),
    meta: {
      tournaments,
      count,
    },
  };
};

// Props
// ---------------
interface PageProps {
  params: {
    range?: string[];
  };
}

// Page
// ---------------
const CompositionsPage = async ({ params }: PageProps) => {
  const range = toRange(params.range?.[0]);
  const from = fromDate(range ? range.from : pointsUpdateDate);
  const to = range ? fromDate(range.to) : undefined;

  const { stats, meta } = await getStats(from, to);

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
            <Inline className="whitespace-nowrap">
              <Trophy className="h-3 w-3" /> {meta.tournaments} Tournaments
            </Inline>
            <Inline className="whitespace-nowrap">
              <Rocket className="h-3 w-3" /> {meta.count.all} Squads
            </Inline>
          </Inline>
        </Caption>
      </div>
      <QueryFilter></QueryFilter>
      <CompositionFilterProvider>
        <StatsFilter smallSamples={false} dateRange={toDate(from, to)}>
          <CompositionFilter />
        </StatsFilter>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="col-span-full">
            <Card inset="headless">
              <Card.Body>
                <CompositionTable
                  value={stats.composition}
                  collapsible={false}
                />
              </Card.Body>
            </Card>
          </div>
          <div className="col-span-full pt-8 lg:col-start-2 lg:col-end-12">
            <StatsHint />
          </div>
        </div>
      </CompositionFilterProvider>
    </>
  );
};

export default CompositionsPage;

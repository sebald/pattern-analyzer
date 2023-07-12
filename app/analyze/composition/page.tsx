import { cache } from 'react';
import { z } from 'zod';

import { baseUrl, pointsUpdateDate } from '@/lib/config';
import { create } from '@/lib/stats';
import { formatDate, fromDate, toDate, today } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';

import { Caption, Inline, Message, Title } from '@/ui';
import { Calendar, Rocket, Trophy } from '@/ui/icons';

import { CompositionStats } from '@/ui/stats/composition-stats';
import { Filter } from '@/ui/stats/filter';
import { StatsHint } from '@/ui/stats/stats-hint';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 21600; // 6 hours

// Metadata
// ---------------
export const metadata = {
  title: 'Pattern Analyzer | Analyze',
  description: 'Analyze the current X-Wing meta!',
  openGraph: {
    siteName: 'Pattern Analyzer',
    title: 'Analyze',
    description: 'Analyze the current X-Wing meta!',
    images: `${baseUrl}/api/og.png`,
    locale: 'en-US',
    type: 'website',
  },
};

// Helpers
// ---------------
// Note: only checks the format, can still produce invalid dates (like 2022-02-31)
const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;

const schema = z
  .object({
    from: z.string().regex(DATE_REGEX).optional(),
    to: z.string().regex(DATE_REGEX).optional(),
    'small-samples': z.union([z.literal('show'), z.literal('hide')]).optional(),
  })
  .transform(({ 'small-samples': smallSamples, ...props }) => ({
    ...props,
    smallSamples: smallSamples === 'show',
  }));

// Data
// ---------------
const getStats = cache(
  async (from: Date, to: Date | undefined, smallSamples: boolean) => {
    const tournaments = await getAllTournaments({
      from,
      to,
      format: 'standard',
    });

    const squads = await Promise.all(
      tournaments.map(({ id }) => getSquads({ id: `${id}` }))
    );
    let stats = create(squads, { smallSamples });

    return { tournament: stats.tournament, composition: stats.composition };
  }
);

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
  const params = schema.safeParse(searchParams);

  if (!params.success) {
    return (
      <div className="grid flex-1 place-items-center">
        <Message variant="error">
          <Message.Title>Whoopsie, something went wrong!</Message.Title>
          Looks like there is an error in the given query parameters.
        </Message>
      </div>
    );
  }

  const from =
    params.data && params.data.from
      ? fromDate(params.data.from)
      : fromDate(pointsUpdateDate);
  const to =
    params.data && params.data.to ? fromDate(params.data.to) : undefined;

  const stats = await getStats(from, to, params.data.smallSamples);

  return (
    <>
      <div className="pb-6">
        <Title>Composition</Title>
        <Caption>
          <Inline className="gap-4">
            <Inline className="whitespace-nowrap">
              <Calendar className="h-3 w-3" /> {formatDate(from)} -{' '}
              {formatDate(to || today())}
            </Inline>
            <Inline className="whitespace-nowrap">
              <Trophy className="h-3 w-3" /> {stats.tournament.total}{' '}
              Tournaments
            </Inline>
            <Inline className="whitespace-nowrap">
              <Rocket className="h-3 w-3" /> {stats.tournament.count} Squads
            </Inline>
          </Inline>
        </Caption>
      </div>
      <Filter
        smallSamples={!params.data.smallSamples}
        dateRange={toDate(from, to)}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="col-span-full">
          <CompositionStats value={stats.composition} />
        </div>
        <div className="col-span-full pt-8 lg:col-start-2 lg:col-end-12">
          <StatsHint />
        </div>
      </div>
    </>
  );
};

export default AnalyzePage;
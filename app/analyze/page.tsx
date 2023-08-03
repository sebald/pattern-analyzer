import { cache } from 'react';
import { z } from 'zod';

import { getSquads } from '@/lib/db';
import { pointsUpdateDate } from '@/lib/config';
import { createMetadata } from '@/lib/metadata';
import { setup } from '@/lib/stats';
import {
  composition,
  faction,
  pilot,
  pilotCostDistribution,
  pilotSkillDistribution,
  ship,
  squadSize,
  upgrade,
  type CompositionData,
  type FactionData,
  type PilotData,
  type PilotCostDistributionData,
  type PilotSkillDistributionData,
  type ShipData,
  type SquadSizeData,
  type UpgradeData,
} from '@/lib/stats/module';
import { formatDate, fromDate, toDate, today } from '@/lib/utils/date.utils';

import { Caption, Inline, Message, Title } from '@/ui';
import { Calendar, Rocket, Trophy } from '@/ui/icons';

import { ChassisDistribution } from '@/ui/stats/chassis-distribution';
import { CompositionStats } from '@/ui/stats/composition-stats';
import { FactionDistribution } from '@/ui/stats/faction-distribution';
import { FactionPerformance } from '@/ui/stats/faction-performance';
import { FactionVictories } from '@/ui/stats/faction-victories';
import { Filter } from '@/ui/stats/filter';
import { PilotCostDistribution } from '@/ui/stats/pilot-cost-distribution';
import { PilotSkillDistribution } from '@/ui/stats/pilot-skill-distribution';
import { PilotStats } from '@/ui/stats/pilot-stats';
import { SquadSize } from '@/ui/stats/squad-size';
import { StatsHint } from '@/ui/stats/stats-hint';
import { UpgradeStats } from '@/ui/stats/upgrade-stats';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 21600; // 6 hours

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Analyze',
  description: 'Analyze the current X-Wing meta!',
});

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

interface StatsData
  extends CompositionData,
    FactionData,
    PilotData,
    PilotCostDistributionData,
    PilotSkillDistributionData,
    ShipData,
    SquadSizeData,
    UpgradeData {}

const create = setup<StatsData>([
  composition,
  faction,
  pilotCostDistribution,
  pilotSkillDistribution,
  pilot,
  ship,
  squadSize,
  upgrade,
]);

// Data
// ---------------
const getStats = cache(
  async (from: Date, to: Date | undefined, smallSamples: boolean) => {
    const { squads, meta } = await getSquads({ from, to });
    return {
      stats: create(squads, {
        smallSamples,
        count: meta.count,
        tournaments: meta.tournaments,
      }),
      meta,
    };
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

  const { stats, meta } = await getStats(from, to, params.data.smallSamples);

  return (
    <>
      <div className="pb-6">
        <Title>Analyze</Title>
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
      <Filter
        smallSamples={!params.data.smallSamples}
        dateRange={toDate(from, to)}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <FactionDistribution value={stats.faction} total={meta.count.all} />
        </div>
        <div className="md:col-span-6">
          <FactionPerformance value={stats.faction} />
        </div>
        <div className="md:col-span-6">
          <FactionVictories value={stats.faction} total={meta.tournaments} />
        </div>
        <div className="md:col-span-6">
          <SquadSize
            value={stats.squadSize}
            total={meta.count.all - meta.count.unknown}
          />
        </div>
        <div className="col-span-full">
          <ChassisDistribution value={stats.ship} />
        </div>
        <div className="md:col-span-6">
          <PilotCostDistribution value={stats.pilotCostDistribution} />
        </div>
        <div className="md:col-span-6">
          <PilotSkillDistribution value={stats.pilotSkillDistribution} />
        </div>
        <div className="col-span-full">
          <PilotStats value={stats.pilot} />
        </div>
        <div className="col-span-full">
          <UpgradeStats value={stats.upgrade} />
        </div>
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

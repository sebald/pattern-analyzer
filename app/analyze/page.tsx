import { z } from 'zod';

import { create } from '@/lib/stats/create';
import {
  formatDate,
  fromDate,
  isSameDate,
  monthsAgo,
  today,
} from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';

import { Caption, Inline, Link, Message, Select, Title } from '@/ui';
import { Calendar } from '@/ui/icons';

import { ChassisDistribution } from '@/ui/stats/chassis-distribution';
import { FactionDistribution } from '@/ui/stats/faction-distribution';
import { FactionPerformance } from '@/ui/stats/faction-performance';
import { PilotCostDistribution } from '@/ui/stats/pilot-cost-distribution';
import { PilotSkillDistribution } from '@/ui/stats/pilot-skill-distribution';
import { PilotStats } from '@/ui/stats/pilot-stats';
import { ShipComposition } from '@/ui/stats/ship-composition';
import { SquadSize } from '@/ui/stats/squad-size';
import { UpgradeStats } from '@/ui/stats/upgrade-stats';
import { DateSelection } from './components/DateSelection';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 10800; // 3 hours

// Helpers
// ---------------
// Note: only checks the format, can still produce invalid dates (like 2022-02-31)
const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;

const schema = z.object({
  from: z.string().regex(DATE_REGEX).optional(),
  to: z.string().regex(DATE_REGEX).optional(),
});

// Data
// ---------------
interface GetStatsProps {
  from: Date;
  to?: Date;
}

const getStats = async ({ from, to }: GetStatsProps) => {
  const tournaments = await getAllTournaments({
    from,
    to,
    format: 'standard',
  });

  const squads = await Promise.all(
    tournaments.map(({ id }) => getSquads({ id: `${id}` }))
  );
  const stats = create(squads);

  return stats;
};

// Props
// ---------------
interface AnalyzePageProps {
  searchParams: {
    from: string;
    to: string;
  };
}

// Page
// ---------------
const AnalyzePage = async ({ searchParams }: AnalyzePageProps) => {
  const params = schema.safeParse(searchParams);

  if (!params.success) {
    return 'nope';
  }

  const from =
    params.data && params.data.from ? fromDate(params.data.from) : monthsAgo(1);
  const to =
    params.data && params.data.to ? fromDate(params.data.to) : undefined;

  const selectedTimeframe = '';

  const stats = await getStats({ from, to });
  return (
    <>
      <header className="mb-4 border-b border-b-primary-100 pb-6 md:mt-3">
        <Title>Analyze</Title>
        <Caption>
          <Inline className="gap-4">
            <Inline className="whitespace-nowrap">
              <Calendar className="h-3 w-3" /> {formatDate(from)} -{' '}
              {formatDate(to || today())}
            </Inline>
          </Inline>
        </Caption>
      </header>
      <div className="flex flex-row items-end justify-end gap-2 pb-8 sm:gap-4">
        <DateSelection />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <FactionDistribution
            value={stats.faction}
            total={stats.tournament.count}
          />
        </div>
        <div className="md:col-span-6">
          <FactionPerformance value={stats.faction} />
        </div>
        <div className="md:col-span-6">
          <SquadSize value={stats.squadSizes} total={stats.tournament.xws} />
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
        <div className="self-start md:col-span-4">
          <ShipComposition
            value={stats.shipComposition}
            total={stats.tournament.xws}
          />
        </div>
        <div className="col-span-full lg:col-start-2 lg:col-end-11">
          <Message align="center">
            <Message.Title>
              For information about some commonly used terms, see the
              &quot;About the Data&quot; secion on the{' '}
              <Link className="underline underline-offset-2" href="/about">
                About page
              </Link>
              .
            </Message.Title>
          </Message>
        </div>
      </div>
    </>
  );
};

export default AnalyzePage;

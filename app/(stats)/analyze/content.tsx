import { Suspense } from 'react';
import { getSquads, getFactionCount } from '@/lib/db/squads';
import { getTournamentsCount } from '@/lib/db/tournaments';
import { ChassisDistribution } from '@/ui/stats/chassis-distribution';
import { CompositionStats } from '@/ui/stats/composition-stats';
import { FactionDistribution } from '@/ui/stats/faction-distribution';
import { FactionPerformance } from '@/ui/stats/faction-performance';
import { FactionVictories } from '@/ui/stats/faction-victories';
import { PilotCostDistribution } from '@/ui/stats/pilot-cost-distribution';
import { PilotSkillDistribution } from '@/ui/stats/pilot-skill-distribution';
import { CardChartSkeleton } from '@/ui/skeleton';
import { PilotStats } from '@/ui/stats/pilot-stats';
import { SquadSize } from '@/ui/stats/squad-size';
import { StatsHint } from '@/ui/stats/stats-hint';
import { UpgradeStats } from '@/ui/stats/upgrade-stats';
import { setup } from '@/lib/stats';
import {
  CompositionData,
  FactionData,
  PilotData,
  PilotCostDistributionData,
  PilotSkillDistributionData,
  ShipData,
  SquadSizeData,
  UpgradeData,
  composition,
  faction,
  pilotCostDistribution,
  pilotSkillDistribution,
  pilot,
  ship,
  squadSize,
  upgrade,
} from '@/lib/stats/module';

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

// Props
// ---------------
export interface ContentProps {
  from: Date;
  to?: Date;
}

// Component
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
    smallSamples: false,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <FactionDistribution
            value={stats.faction}
            total={count.all}
            ignoreUnknown
          />
        </div>
        <div className="md:col-span-6">
          <FactionPerformance value={stats.faction} ignoreUnknown />
        </div>
        <div className="md:col-span-6">
          <FactionVictories value={stats.faction} total={tournaments} />
        </div>
        <div className="md:col-span-6">
          <SquadSize
            value={stats.squadSize}
            total={count.all - count.unknown}
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

export const Content = (props: ContentProps) => (
  <Suspense fallback={<Loading />}>
    <AsyncContent {...props} />
  </Suspense>
);

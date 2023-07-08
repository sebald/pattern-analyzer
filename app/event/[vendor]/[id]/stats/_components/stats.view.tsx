import type { SquadData } from '@/lib/types';
import { create } from '@/lib/stats/create';

import { ChassisDistribution } from '@/ui/stats/chassis-distribution';
import { FactionCut } from '@/ui/stats/faction-cut';
import { FactionDistribution } from '@/ui/stats/faction-distribution';
import { FactionPerformance } from '@/ui/stats/faction-performance';
import { FactionRecord } from '@/ui/stats/faction-record';
import { PilotCostDistribution } from '@/ui/stats/pilot-cost-distribution';
import { PilotSkillDistribution } from '@/ui/stats/pilot-skill-distribution';
import { PilotStats } from '@/ui/stats/pilot-stats';
import { SquadSize } from '@/ui/stats/squad-size';
import { StatsHint } from '@/ui/stats/stats-hint';
import { UpgradeStats } from '@/ui/stats/upgrade-stats';

export interface StatsViewProps {
  squads: SquadData[];
}

export const StatsView = ({ squads }: StatsViewProps) => {
  const stats = create([squads]);

  return (
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
      <div className="md:col-span-5">
        <FactionRecord value={stats.faction} />
      </div>
      <div className="md:col-span-7">
        <FactionCut tournament={stats.tournament} value={stats.faction} />
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
      <div className="col-span-full pt-8 lg:col-start-2 lg:col-end-12">
        <StatsHint />
      </div>
    </div>
  );
};

import { useSquadStats } from '@/lib/stats/useSquadStats';
import { SquadData } from '@/lib/types';
import { Link, Message } from '@/ui';

import { ChassisDistribution } from '@/ui/stats/chassis-distribution';
import { FactionCut } from '@/ui/stats/faction-cut';
import { FactionDistribution } from '@/ui/stats/faction-distribution';
import { FactionPerformance } from '@/ui/stats/faction-performance';
import { FactionRecord } from '@/ui/stats/faction-record';
import { PilotCostDistribution } from '@/ui/stats/pilot-cost-distribution';
import { PilotSkillDistribution } from '@/ui/stats/pilot-skill-distribution';
import { PilotStats } from '@/ui/stats/pilot-stats';
import { ShipComposition } from '@/ui/stats/ship-composition';
import { SquadSize } from '@/ui/stats/squad-size';
import { UpgradeStats } from '@/ui/stats/upgrade-stats';

export interface StatsViewProps {
  squads: SquadData[];
}

export const StatsView = ({ squads }: StatsViewProps) => {
  const stats = useSquadStats({ squads: [squads] });

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
      <div className="self-start md:col-span-4">
        <ShipComposition
          value={stats.shipComposition}
          total={stats.tournament.xws}
        />
      </div>
      <div className="col-span-full lg:col-start-2 lg:col-end-11">
        <Message align="center">
          <Message.Title>
            For information about some commonly used terms, see the &quot;About
            the Data&quot; secion on the{' '}
            <Link className="underline underline-offset-2" href="/about">
              About page
            </Link>
            .
          </Message.Title>
        </Message>
      </div>
    </div>
  );
};

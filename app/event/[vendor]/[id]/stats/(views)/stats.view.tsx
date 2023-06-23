import { SquadData } from '@/lib/types';
import { Link, Message } from '@/ui';

import { useSquadStats } from './useSquadStats';

import { ChassisDistribution } from './components/chassis-distribution';
import { FactionCut } from './components/faction-cut';
import { FactionDistribution } from './components/faction-distribution';
import { FactionPerformance } from './components/faction-performance';
import { FactionRecord } from './components/faction-record';
import { PilotCostDistribution } from './components/pilot-cost-distribution';
import { PilotSkillDistribution } from './components/pilot-skill-distribution';
import { PilotStats } from './components/pilot-stats';
import { ShipComposition } from './components/ship-composition';
import { SquadSize } from './components/squad-size';
import { UpgradeStats } from './components/upgrade-stats';

export interface StatsViewProps {
  squads: SquadData[];
}

export const StatsView = ({ squads }: StatsViewProps) => {
  const data = useSquadStats({ squads });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-6">
        <FactionDistribution
          value={data.factionStats}
          total={data.tournamentStats.count}
        />
      </div>
      <div className="md:col-span-6">
        <FactionPerformance value={data.factionStats} />
      </div>
      <div className="md:col-span-5">
        <FactionRecord value={data.factionStats} />
      </div>
      <div className="md:col-span-7">
        <FactionCut
          tournament={data.tournamentStats}
          value={data.factionStats}
        />
      </div>
      <div className="md:col-span-6">
        <SquadSize value={data.squadSizes} total={data.tournamentStats.xws} />
      </div>
      <div className="col-span-full">
        <ChassisDistribution value={data.shipStats} />
      </div>
      <div className="md:col-span-6">
        <PilotCostDistribution value={data.pilotCostDistribution} />
      </div>
      <div className="md:col-span-6">
        <PilotSkillDistribution value={data.pilotSkillDistribution} />
      </div>
      <div className="col-span-full">
        <PilotStats value={data.pilotStats} />
      </div>
      <div className="col-span-full">
        <UpgradeStats value={data.upgradeStats} />
      </div>
      <div className="self-start md:col-span-4">
        <ShipComposition
          value={data.shipComposition}
          total={data.tournamentStats.xws}
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

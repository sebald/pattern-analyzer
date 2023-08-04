import { toSquadEntitiy, type SquadEntitiy } from '@/lib/db';
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
import type { SquadData } from '@/lib/types';

import { ChassisDistribution } from '@/ui/stats/chassis-distribution';
import { CompositionStats } from '@/ui/stats/composition-stats';
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

// Helpers
// ---------------
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
export interface StatsViewProps {
  squads: SquadData[];
}

// Component
// ---------------
export const StatsView = ({ squads }: StatsViewProps) => {
  const tournament = {
    total: squads.length,
    date: new Date(), // FIXME: we do not need this here really, right?
  };

  const entities: SquadEntitiy[] = [];
  const count = {
    all: squads.length,
    rebelalliance: 0,
    galacticempire: 0,
    scumandvillainy: 0,
    resistance: 0,
    firstorder: 0,
    galacticrepublic: 0,
    separatistalliance: 0,
    unknown: 0,
  };
  let cut = 0;

  squads.forEach(sq => {
    entities.push(toSquadEntitiy(sq, tournament));
    count[sq.xws?.faction ?? 'unknown'] = +1;

    if (sq.rank.elimination) {
      cut += 1;
    }
  });

  const stats = create(entities, {
    tournaments: 1,
    count,
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-6">
        <FactionDistribution value={stats.faction} total={count.all} />
      </div>
      <div className="md:col-span-6">
        <FactionPerformance value={stats.faction} />
      </div>
      <div className="md:col-span-5">
        <FactionRecord value={stats.faction} />
      </div>
      <div className="md:col-span-7">
        <FactionCut tournament={{ count, cut }} value={stats.faction} />
      </div>
      <div className="md:col-span-6">
        <SquadSize value={stats.squadSize} total={count.all - count.unknown} />
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
  );
};

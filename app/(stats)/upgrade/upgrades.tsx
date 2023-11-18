'use client';

import type { UpgradeData } from '@/lib/stats/module';

import { Card } from '@/ui';
import { useFactionFilter } from '@/ui/params/faction-filter';
import { useSlotFilter } from '@/ui/params/slot-param';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { useSortParam } from '@/ui/params/sort-param';
import { UpgradeTable } from '@/ui/stats/upgrade-stats/upgrade-table';

// Props
// ---------------
export interface UpgradesProps {
  data: UpgradeData['upgrade'];
}

// Component
// ---------------
export const Upgrades = ({ data }: UpgradesProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  const [faction] = useFactionFilter();
  const [slot] = useSlotFilter();
  const [sort] = useSortParam();

  return (
    <Card inset="headless">
      <Card.Body>
        <UpgradeTable
          value={data}
          collapsible={false}
          filter={([, stat]) => {
            if (smallSamples === 'hide' && (stat.count < 3 || stat.score < 5)) {
              return false;
            }

            if (stat.faction !== faction) {
              return false;
            }

            if (slot !== 'all' && stat.slot !== slot) {
              return false;
            }

            return true;
          }}
          sortBy={sort}
        />
      </Card.Body>
    </Card>
  );
};

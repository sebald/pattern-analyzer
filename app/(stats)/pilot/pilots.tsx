'use client';

import type { PilotData } from '@/lib/stats/module';

import { Card } from '@/ui';
import { PilotTable } from '@/ui/stats/pilot-stats';
import { useFactionFilter } from '@/ui/params/faction-filter';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { useSortParam } from '@/ui/params/sort-param';

// Props
// ---------------
export interface PilotsProps {
  data: PilotData['pilot'];
}

// Component
// ---------------
export const Pilots = ({ data }: PilotsProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  const [faction] = useFactionFilter();
  const [sort] = useSortParam();

  return (
    <Card inset="headless">
      <Card.Body>
        <PilotTable
          value={data}
          collapsible={false}
          filter={([, stat]) => {
            if (smallSamples === 'hide' && (stat.count < 3 || stat.score < 5)) {
              return false;
            }

            if (faction !== 'all' && stat.faction !== faction) {
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

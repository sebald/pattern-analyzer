'use client';

import type { CompositionData } from '@/lib/stats/module/composition';

import { Card } from '@/ui';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { useFactionFilter } from '@/ui/params/faction-filter';
import { useSortParam } from '@/ui/params/sort-param';
import { CompositionTable } from '@/ui/stats/composition-stats';

// Props
// ---------------
export interface CompositionsProps {
  data: CompositionData['composition'];
}

// Component
// ---------------
export const Compositions = ({ data }: CompositionsProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  const [faction] = useFactionFilter();
  const [sort] = useSortParam();

  return (
    <Card inset="list">
      <Card.Body variant="enumeration">
        <CompositionTable
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

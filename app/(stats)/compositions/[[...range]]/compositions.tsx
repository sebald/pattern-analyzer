'use client';

import { Card } from '@/ui';
import { useSmallSamplesFilter } from '@/ui/filter/small-samples-filter';
import { useFactionFilter } from '@/ui/filter/faction-filter';
import { CompositionTable } from '@/ui/stats/composition-stats';

import type { CompositionData } from '@/lib/stats/module/composition';

export interface CompositionsProps {
  data: CompositionData['composition'];
}

export const Compositions = ({ data }: CompositionsProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  const [faction] = useFactionFilter();

  return (
    <Card inset="headless">
      <Card.Body>
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
        />
      </Card.Body>
    </Card>
  );
};

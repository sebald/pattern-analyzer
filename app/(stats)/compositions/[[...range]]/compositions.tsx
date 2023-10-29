'use client';

import { Card } from '@/ui';
import { useSmallSamplesFilter } from '@/ui/filter/small-samples-filter';
import { CompositionTable } from '@/ui/stats/composition-stats';
import type { CompositionData } from '@/lib/stats/module/composition';

export interface CompositionsProps {
  data: CompositionData['composition'];
}

export const Compositions = ({ data }: CompositionsProps) => {
  const [smallSamples] = useSmallSamplesFilter();

  return (
    <Card inset="headless">
      <Card.Body>
        <CompositionTable
          value={data}
          collapsible={false}
          filter={
            smallSamples === 'hide'
              ? ([, stat]) => stat.count >= 3 && stat.score >= 5
              : undefined
          }
        />
      </Card.Body>
    </Card>
  );
};

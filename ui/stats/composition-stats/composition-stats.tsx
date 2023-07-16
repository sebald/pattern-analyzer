'use client';

import { Card } from '@/ui';

import { CompositionTable } from './composition-table';
import { CompositionFilterProvider, useCompositionFilter } from './context';
import type { CompositionStatsType } from './types';
import { CompositionFilter } from './composition-filter';

// Props
// ---------------
export interface CompositionStatsProps {
  value: { [id: string]: CompositionStatsType };
}

// Component
// ---------------
export const CompositionStats = ({ value }: CompositionStatsProps) => (
  <CompositionFilterProvider>
    <Card>
      <Card.Header>
        <Card.Title>Compositions</Card.Title>
        <Card.Actions>
          <CompositionFilter />
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <CompositionTable value={value} />
      </Card.Body>
    </Card>
  </CompositionFilterProvider>
);

'use client';

import { useState } from 'react';
import { Card, FactionSelection, SortSelection } from '@/ui';
import type { SortOptions } from '@/ui';

import { CompositionTable } from './composition-table';
import type { CompositionStatsType } from './types';
import { XWSFaction } from '@/lib/types';

// Props
// ---------------
export interface CompositionStatsProps {
  value: { [id: string]: CompositionStatsType };
}

// Component
// ---------------
export const CompositionStats = ({ value }: CompositionStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOptions>('percentile');

  return (
    <Card>
      <Card.Header>
        <Card.Title>Compositions</Card.Title>
        <Card.Actions>
          <FactionSelection value={faction} onChange={setFaction} allowAll />
          <SortSelection value={sortBy} onChange={setSortBy} />
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <CompositionTable
          value={value}
          filter={
            faction !== 'all'
              ? ([, stat]) => stat.faction === faction
              : undefined
          }
          sortBy={sortBy}
        />
      </Card.Body>
    </Card>
  );
};

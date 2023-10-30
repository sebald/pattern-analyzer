'use client';

import { useState } from 'react';
import { Card, FactionSelection, Select } from '@/ui';

import { CompositionTable } from './composition-table';
import type { SortOptions } from './composition-table';
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
          <Select
            size="small"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <Select.Option value="percentile">By Percentile</Select.Option>
            <Select.Option value="deviation">By Std. Deviation</Select.Option>
            <Select.Option value="winrate">By Winrate</Select.Option>
            <Select.Option value="frequency">By Frequency</Select.Option>
            <Select.Option value="count">By Count</Select.Option>
            <Select.Option value="score">By Score</Select.Option>
          </Select>
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

'use client';

import { useState } from 'react';

import { Card, Collapsible, FactionSelection, Select } from '@/ui';
import type { XWSFaction } from '@/lib/types';

import type { CompositionStatsType } from './types';
import { CompositionTable } from './composition-table';

// Props
// ---------------
export interface CompositionStatsProps {
  value: { [id: string]: CompositionStatsType };
}

// Component
// ---------------
export const CompositionStats = ({ value }: CompositionStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');
  const [sort, setSort] = useState<
    'percentile' | 'deviation' | 'winrate' | 'frequency' | 'count' | 'score'
  >('percentile');

  return (
    <Card>
      <Card.Header>
        <Card.Title>Compositions</Card.Title>
        <Card.Actions>
          <FactionSelection value={faction} onChange={setFaction} allowAll />
          <Select
            size="small"
            value={sort}
            onChange={e => setSort(e.target.value as any)}
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
        <CompositionTable value={value} faction={faction} sort={sort} />
      </Card.Body>
    </Card>
  );
};

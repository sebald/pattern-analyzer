'use client';

import { useState } from 'react';

import { Card, FactionSelection, Select, type SortOptions } from '@/ui';

import type { FactionMap } from '@/lib/stats/types';
import type { XWSFaction } from '@/lib/types';

import { PilotTable } from './pilot-table';
import type { PilotStatsType } from './types';

// Props
// ---------------
export interface PilotStatsProps {
  value: FactionMap<string, PilotStatsType>;
}

// Component
// ---------------
export const PilotStats = ({ value }: PilotStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOptions>('percentile');

  return (
    <Card>
      <Card.Header>
        <Card.Title>Pilots</Card.Title>
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
        <PilotTable
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

'use client';

import { useState } from 'react';

import { Card } from '@/ui/card';
import { FactionSelection } from '@/ui/faction-selection';
import { Select } from '@/ui/select';
import { type SortOptions } from '@/ui/sort-selection';
import { UpgradeSlotSelection } from '@/ui/upgrade-slot-selection';

import type { FactionMapWithAll } from '@/lib/stats/types';
import { XWSFaction, XWSUpgradeSlots } from '@pattern-analyzer/xws/types';
import type { UpgradeStatsType } from './types';
import { UpgradeTable } from './upgrade-table';

// Props
// ---------------
export interface UpgradeStatsProps {
  value: FactionMapWithAll<string, UpgradeStatsType>;
}

// Component
// ---------------
export const UpgradeStats = ({ value }: UpgradeStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');
  const [slot, setSlot] = useState<XWSUpgradeSlots | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOptions>('percentile');

  return (
    <Card>
      <Card.Header>
        <Card.Title>Upgrades</Card.Title>
        <Card.Actions>
          <FactionSelection value={faction} onChange={setFaction} allowAll />
          <UpgradeSlotSelection value={slot} onChange={setSlot} allowAll />
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
        <UpgradeTable
          value={value}
          filter={([, stat]) =>
            stat.faction === faction &&
            (slot === 'all' ? true : stat.slot === slot)
          }
          sortBy={sortBy}
        />
      </Card.Body>
    </Card>
  );
};

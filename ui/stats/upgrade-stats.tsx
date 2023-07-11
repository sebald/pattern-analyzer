'use client';

import { Fragment, useState } from 'react';

import {
  Card,
  Collapsible,
  FactionSelection,
  Select,
  Table,
  UpgradeSlotSelection,
} from '@/ui';
import { getUpgradeName } from '@/lib/get-value';
import type { XWSFaction, XWSUpgradeSlots } from '@/lib/types';
import { toPercentage } from '@/lib/utils';

import type {
  FactionMapWithAll,
  UpgradeStats as UpgradeStatsType,
} from '@/lib/stats/types';

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
  const [sort, setSort] = useState<
    'percentile' | 'deviation' | 'winrate' | 'frequency' | 'count' | 'score'
  >('percentile');

  const data = [
    ...(Object.entries(value[faction]) as [string, UpgradeStatsType][]),
  ].filter(([, info]) => (slot === 'all' ? true : info.slot === slot));

  data.sort(([, a], [, b]) => {
    const result = (b[sort] || 0) - (a[sort] || 0);

    // Secondary sort by percentile (or deviation if sorted by percentile already)
    return result !== 0
      ? result
      : sort === 'percentile'
      ? b.deviation - a.deviation
      : b.percentile - a.percentile;
  });

  return (
    <Card>
      <Card.Header>
        <Card.Title>Upgrades</Card.Title>
        <Card.Actions>
          <FactionSelection value={faction} onChange={setFaction} allowAll />
          <UpgradeSlotSelection value={slot} onChange={setSlot} allowAll />
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
        <Collapsible maxHeight={375}>
          <Table
            cols={[
              'minmax(auto, max-content)',
              '1fr',
              '1fr',
              '1fr',
              'minmax(90px, 1fr)',
              '85px',
              '85px',
            ]}
            headers={[
              'Upgrade',
              'Percentile',
              'Std. Deviation',
              'Winrate',
              'Frequency',
              'Count',
              'Score',
            ]}
            numeration
          >
            {data.map(([upgrade, stat]) => (
              <Fragment key={upgrade}>
                <Table.Cell variant="header">
                  <div className="text-sm font-semibold">
                    {getUpgradeName(upgrade) || upgrade}
                  </div>
                </Table.Cell>
                <Table.Cell variant="number">
                  {toPercentage(stat.percentile)}
                </Table.Cell>
                <Table.Cell variant="number">
                  {stat.deviation === 0 ? '-' : toPercentage(stat.deviation)}
                </Table.Cell>
                <Table.Cell variant="number">
                  {stat.winrate !== null ? toPercentage(stat.winrate) : '-'}
                </Table.Cell>
                <Table.Cell variant="number">
                  {toPercentage(stat.frequency)}
                </Table.Cell>
                <Table.Cell variant="number">{stat.count}</Table.Cell>
                <Table.Cell variant="number">{stat.score}</Table.Cell>
              </Fragment>
            ))}
          </Table>
        </Collapsible>
      </Card.Body>
    </Card>
  );
};

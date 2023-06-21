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

import type { FactionMapWithAll, UpgradeStatData } from '../../types';

// Props
// ---------------
export interface UpgradeStatsProps {
  value: FactionMapWithAll<string, UpgradeStatData>;
}

// Component
// ---------------
export const UpgradeStats = ({ value }: UpgradeStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');
  const [slot, setSlot] = useState<XWSUpgradeSlots | 'all'>('all');
  const [sort, setSort] = useState<
    'percentile' | 'deviation' | 'winrate' | 'frequency' | 'count'
  >('percentile');

  const data = [
    ...(Object.entries(value[faction]) as [string, UpgradeStatData][]),
  ]
    .filter(([, info]) => (slot === 'all' ? true : info.slot === slot))
    .sort(([, a], [, b]) => b[sort] - a[sort]);

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
              '70px',
            ]}
            headers={[
              'Upgrade',
              'Percentile',
              'Std. Deviation',
              'Winrate',
              'Frequency',
              'Count',
            ]}
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
                  {toPercentage(stat.winrate)}
                </Table.Cell>
                <Table.Cell variant="number">
                  {toPercentage(stat.frequency)}
                </Table.Cell>
                <Table.Cell variant="number">{stat.count}</Table.Cell>
              </Fragment>
            ))}
          </Table>
        </Collapsible>
      </Card.Body>
    </Card>
  );
};

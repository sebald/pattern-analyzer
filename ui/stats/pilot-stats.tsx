'use client';

import { Fragment, useState } from 'react';

import {
  Card,
  Collapsible,
  FactionSelection,
  Select,
  ShipIcon,
  Table,
} from '@/ui';
import type {
  FactionMap,
  PilotStats as PilotStatsType,
} from '@/lib/stats/types';
import type { XWSFaction } from '@/lib/types';
import { getPilotName } from '@/lib/get-value';
import { toPercentage } from '@/lib/utils';

// Props
// ---------------
export interface PilotStatsProps {
  value: FactionMap<string, PilotStatsType>;
}

// Component
// ---------------
export const PilotStats = ({ value }: PilotStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');
  const [sort, setSort] = useState<
    'percentile' | 'deviation' | 'winrate' | 'frequency' | 'count'
  >('percentile');

  const data =
    faction === 'all'
      ? Object.values(value).reduce((acc: [string, PilotStatsType][], map) => {
          return [
            ...acc,
            ...(Object.entries(map) as [string, PilotStatsType][]),
          ];
        }, [])
      : [...(Object.entries(value[faction]) as [string, PilotStatsType][])];
  data.sort(([, a], [, b]) => (b[sort] || 0) - (a[sort] || 0));

  return (
    <Card>
      <Card.Header>
        <Card.Title>Pilots</Card.Title>
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
              'Pilot',
              'Percentile',
              'Std. Deviation',
              'Winrate',
              'Frequency',
              'Count',
            ]}
            numeration
          >
            {data.map(([pilot, stat]) => (
              <Fragment key={pilot}>
                <Table.Cell variant="header">
                  <ShipIcon ship={stat.ship} className="w-5 text-xl" />
                  <div className="text-sm font-semibold">
                    {getPilotName(pilot) || pilot}
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
              </Fragment>
            ))}
          </Table>
        </Collapsible>
      </Card.Body>
    </Card>
  );
};

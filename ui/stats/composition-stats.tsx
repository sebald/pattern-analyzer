'use client';

import { Fragment, useState } from 'react';

import {
  Card,
  Collapsible,
  FactionIcon,
  FactionSelection,
  Select,
  ShipIcon,
  Table,
} from '@/ui';
import type { CompositionStats as CompositionStatsType } from '@/lib/stats/types';
import { round, toPercentage } from '@/lib/utils/math.utils';
import { XWSFaction } from '@/lib/types';

// Helpers
// ---------------
const calcMagicNumber = (stat: CompositionStatsType) =>
  round(stat.percentile * stat.frequency * stat.xws.length * 100, 2);

interface CompositionStatsTypeWithMagic extends CompositionStatsType {
  magic: number;
}

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
    'percentile' | 'deviation' | 'winrate' | 'frequency' | 'count' | 'magic'
  >('percentile');

  let data = (Object.entries(value) as [string, CompositionStatsType][]).map(
    ([id, stat]) => {
      return [id, { ...stat, magic: calcMagicNumber(stat) }] as [
        string,
        CompositionStatsTypeWithMagic
      ];
    }
  );

  if (faction !== 'all') {
    data = data.filter(
      ([_, stat]: [string, CompositionStatsType]) => stat.faction === faction
    );
  }

  data.sort(([, a], [, b]) =>
    sort === 'count'
      ? b.xws.length - a.xws.length
      : (b[sort] || 0) - (a[sort] || 0)
  );

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
            <Select.Option value="magic">By Magic</Select.Option>
          </Select>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <Collapsible maxHeight={800}>
          <Table
            cols={[
              'minmax(auto, max-content)',
              '90px',
              '1fr',
              '1fr',
              '1fr',
              'minmax(90px, 1fr)',
              '70px',
              '70px',
            ]}
            headers={[
              'Ships',
              'Faction',
              'Percentile',
              'Std. Deviation',
              'Winrate',
              'Frequency',
              'Count',
              'Score',
            ]}
          >
            {data.map(([id, stat]) => (
              <Fragment key={id}>
                <Table.Cell
                  variant="header"
                  className="flex flex-row items-center gap-1"
                >
                  {stat.ships.map((ship, idx) => (
                    <ShipIcon
                      key={idx}
                      ship={ship}
                      className="text-2xl text-secondary-700"
                    />
                  ))}
                </Table.Cell>
                <Table.Cell>
                  <FactionIcon
                    faction={stat.faction}
                    className="h-5 w-5 text-secondary-700"
                  />
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
                <Table.Cell variant="number">{stat.xws.length}</Table.Cell>
                <Table.Cell variant="number">{stat.magic}</Table.Cell>
              </Fragment>
            ))}
          </Table>
        </Collapsible>
      </Card.Body>
    </Card>
  );
};

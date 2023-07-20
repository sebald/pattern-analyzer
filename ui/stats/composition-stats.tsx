'use client';

import { Fragment, useState } from 'react';

import type { Ships } from '@/lib/get-value';
import {
  Card,
  Collapsible,
  FactionIcon,
  FactionSelection,
  Select,
  ShipIcon,
  Table,
} from '@/ui';
import { toPercentage } from '@/lib/utils/math.utils';
import type { GameRecord, XWSFaction } from '@/lib/types';

interface CompositionStatsType {
  ships: Ships[];
  faction: XWSFaction;
  count: number;
  record: GameRecord;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;
  score: number;
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
    'percentile' | 'deviation' | 'winrate' | 'frequency' | 'count' | 'score'
  >('percentile');

  const data =
    faction === 'all'
      ? (Object.entries(value) as [string, CompositionStatsType][])
      : Object.entries(value).filter(
          ([_, stat]: [string, CompositionStatsType]) =>
            stat.faction === faction
        );

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
        <Collapsible maxHeight={800}>
          <Table
            cols={[
              'minmax(auto, max-content)',
              '120px',
              '1fr',
              '1fr',
              '1fr',
              'minmax(90px, 1fr)',
              '85px',
              '85px',
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
            numeration
          >
            {data.map(([id, stat]) => (
              <Fragment key={id}>
                <Table.Cell
                  variant="header"
                  className="flex flex-row items-center gap-1 lg:gap-2"
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
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
import type { FactionMap } from '@/lib/stats/types';
import type { GameRecord, XWSFaction } from '@/lib/types';
import { Ships, getPilotName } from '@/lib/get-value';
import { toPercentage } from '@/lib/utils';

interface PilotStatsType {
  ship: Ships;
  count: number;
  lists: number;
  record: GameRecord;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;
  score: number;
}

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
    'percentile' | 'deviation' | 'winrate' | 'frequency' | 'count' | 'score'
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
              'Pilot',
              'Percentile',
              'Std. Deviation',
              'Winrate',
              'Frequency',
              'Count',
              'Score',
            ]}
            numeration
          >
            {data.map(([pilot, stat]) => (
              <Fragment key={pilot}>
                <Table.Cell variant="header">
                  <ShipIcon ship={stat.ship} className="w-5 text-xl" />
                  <div className="font-semibold">
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
                <Table.Cell variant="number">{stat.score}</Table.Cell>
              </Fragment>
            ))}
          </Table>
        </Collapsible>
      </Card.Body>
    </Card>
  );
};

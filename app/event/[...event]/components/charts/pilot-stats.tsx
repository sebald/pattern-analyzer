import { useState } from 'react';

import { Card, FactionSelection, Select, ShipIcon, Table } from 'components';
import type { XWSFaction } from 'lib/types';
import { getPilotName } from 'lib/get-value';
import { PilotStatData, toPercentage } from './shared';

export interface PilotStatsProps {
  value: {
    [faction in XWSFaction]: Map<string, PilotStatData>;
  };
}

export const PilotStats = ({ value }: PilotStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction>('rebelalliance');
  const [sort, setSort] = useState<
    'percentile' | 'deviation' | 'winrate' | 'frequency'
  >('percentile');

  const data = Array.from(value[faction].entries()).sort(
    ([, a], [, b]) => b[sort] - a[sort]
  );

  return (
    <Card>
      <Card.Title>Pilots Stats</Card.Title>
      <Card.Body>
        <div className="flex justify-end gap-3 pb-4">
          <FactionSelection value={faction} onChange={setFaction} />
          <Select
            size="small"
            value={sort}
            onChange={e => setSort(e.target.value as any)}
          >
            <Select.Option value="percentile">By Percentile</Select.Option>
            <Select.Option value="deviation">By Std. Deviation</Select.Option>
            <Select.Option value="winrate">By Winrate</Select.Option>
            <Select.Option value="frequency">By Frequency</Select.Option>
          </Select>
        </div>
        <Table
          cols={[
            'max-content',
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
        >
          {data.map(([pilot, stat]) => (
            <>
              <Table.Cell variant="header">
                <ShipIcon ship={stat.ship} className="w-5 text-xl" />
                <div className="text-sm font-bold">{getPilotName(pilot)}</div>
              </Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.percentile)}
              </Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.deviation)}
              </Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.winrate)}
              </Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.frequency)}
              </Table.Cell>
              <Table.Cell variant="number">{stat.count}</Table.Cell>
            </>
          ))}
        </Table>
      </Card.Body>
    </Card>
  );
};
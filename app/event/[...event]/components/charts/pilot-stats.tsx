import { useState } from 'react';

import { Card, FactionSelection, Select, ShipIcon, Table } from 'components';
import type { XWSFaction } from 'lib/types';
import { getPilotName } from 'lib/get-value';
import { FooterHint, PilotStatData, toPercentage } from './shared';

export interface PilotStatsProps {
  value: {
    [faction in XWSFaction]: Map<string, PilotStatData>;
  };
}

export const PilotStats = ({ value }: PilotStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction>('rebelalliance');
  const [sort, setSort] = useState<'percentile' | 'winrate' | 'frequency'>(
    'percentile'
  );

  const data = Array.from(value[faction].entries()).sort(
    ([, a], [, b]) => b[sort] - a[sort]
  );

  return (
    <Card>
      <Card.Title>Pilots*</Card.Title>
      <Card.Body>
        <div className="flex justify-end gap-3 pb-4">
          <FactionSelection value={faction} onChange={setFaction} />
          <Select
            size="small"
            value={sort}
            onChange={e => setSort(e.target.value as any)}
          >
            <Select.Option value="score">By Score</Select.Option>
            <Select.Option value="percentile">By Percentile</Select.Option>
            <Select.Option value="winrate">By Winrate</Select.Option>
            <Select.Option value="frequency">By Frequency</Select.Option>
          </Select>
        </div>
        <Table
          cols={['max-content', '1fr', '1fr', '1fr', 'minmax(100px, 1fr)']}
          headers={[
            'Pilot',
            'Percentile',
            'Winrate',
            'Std. Deviation',
            'Frequency',
          ]}
        >
          {data.map(([pilot, stat]) => (
            <>
              <Table.Cell variant="header">
                <ShipIcon ship={stat.ship} className="w-5 text-xl" />
                <div className="text-sm font-bold">{getPilotName(pilot)}</div>
              </Table.Cell>
              <Table.Cell variant="number">{stat.percentile}</Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.winrate)}
              </Table.Cell>
              <Table.Cell variant="number">{stat.deviation}</Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.frequency)} ({stat.count})
              </Table.Cell>
            </>
          ))}
        </Table>
      </Card.Body>
      <Card.Footer>
        <FooterHint />
      </Card.Footer>
    </Card>
  );
};

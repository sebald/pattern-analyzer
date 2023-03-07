import { useState } from 'react';

import {
  Card,
  FactionSelection,
  List,
  Select,
  ShipIcon,
  Stat,
} from 'components';
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
  const [sort, setSort] = useState<'percentile' | 'performance' | 'frequency'>(
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
            <Select.Option value="percentile">By Percentile</Select.Option>
            <Select.Option value="performance">By Performance</Select.Option>
            <Select.Option value="frequency">By Frequency</Select.Option>
          </Select>
        </div>
        <List variant="compact">
          {data.map(([pilot, stat]) => (
            <List.Item key={pilot}>
              <div className="grid grid-cols-2 gap-1.5 pb-6 pt-4">
                <div className="col-span-full flex flex-row items-center">
                  <ShipIcon
                    ship={stat.ship}
                    className="w-6 text-2xl text-secondary-700"
                  />
                  <div className="text-lg font-bold">{getPilotName(pilot)}</div>
                </div>
                <Stat className="col-span-1">
                  <Stat.Label className="w-1/2">Percentile:</Stat.Label>
                  <Stat.Value>{stat.percentile}</Stat.Value>
                </Stat>
                <Stat className="col-span-1">
                  <Stat.Label className="w-1/2">Performance:</Stat.Label>
                  <Stat.Value>{toPercentage(stat.performance)}</Stat.Value>
                </Stat>
                <Stat className="col-span-1">
                  <Stat.Label className="w-1/2">Std. Deviation:</Stat.Label>
                  <Stat.Value>{stat.deviation}</Stat.Value>
                </Stat>
                <Stat className="col-span-1">
                  <Stat.Label className="w-1/2">Frequency:</Stat.Label>
                  <Stat.Value>
                    {toPercentage(stat.frequency)} ({stat.count})
                  </Stat.Value>
                </Stat>
              </div>
            </List.Item>
          ))}
        </List>
      </Card.Body>
      <Card.Footer>
        <FooterHint />
      </Card.Footer>
    </Card>
  );
};

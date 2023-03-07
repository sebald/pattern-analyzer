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

export interface PilotStatsOldProps {
  value: {
    [faction in XWSFaction]: Map<string, PilotStatData>;
  };
}

export const PilotStatsOld = ({ value }: PilotStatsOldProps) => {
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
        <List
          variant="compact"
          className="grid gap-2 pb-6 pt-4 md:grid-cols-[max-content_1fr_1fr_1fr_1fr] md:gap-0 md:p-0"
        >
          {data.map(([pilot, stat]) => (
            <List.Item key={pilot} className="contents">
              <div className="col-span-full flex flex-row items-center py-2 md:col-auto md:border-t md:pl-2">
                <ShipIcon
                  ship={stat.ship}
                  className="w-6 text-2xl opacity-70 md:w-5 md:text-xl"
                />
                <div className="text-lg font-bold md:text-sm">
                  {getPilotName(pilot)}
                </div>
              </div>
              <Stat className="py-2 md:border-t">
                <Stat.Label className="w-32 md:hidden">Percentile:</Stat.Label>
                <Stat.Value className="w-full text-right">
                  {stat.percentile}
                </Stat.Value>
              </Stat>
              <Stat className="py-2 md:border-t">
                <Stat.Label className="w-32 md:hidden">Performance:</Stat.Label>
                <Stat.Value className="w-full text-right">
                  {toPercentage(stat.winrate)}
                </Stat.Value>
              </Stat>
              <Stat className="py-2 md:border-t">
                <Stat.Label className="w-32 md:hidden">
                  Std. Deviation:
                </Stat.Label>
                <Stat.Value className="w-full text-right">
                  {stat.deviation}
                </Stat.Value>
              </Stat>
              <Stat className="py-2 md:border-t md:pr-2">
                <Stat.Label className="w-32 md:hidden">Frequency:</Stat.Label>
                <Stat.Value className="w-full text-right">
                  {toPercentage(stat.frequency)} ({stat.count})
                </Stat.Value>
              </Stat>
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

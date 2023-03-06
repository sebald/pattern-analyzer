import { useState } from 'react';

import { Card, FactionSelection, List, ShipIcon, Stat } from 'components';
import type { XWSFaction } from 'lib/types';
import { getPilotName } from 'lib/get-value';
import { FooterHint, PilotStatData, toPercentage } from './shared';
import { round } from 'lib/utils';

export interface PilotStatsProps {
  value: {
    [faction in XWSFaction]: Map<string, PilotStatData>;
  };
}

export const PilotStats = ({ value }: PilotStatsProps) => {
  const [faction, setFaction] = useState<XWSFaction>('rebelalliance');

  const data = Array.from(value[faction].entries()).sort(
    ([, a], [, b]) => b.count - a.count
  );

  return (
    <Card>
      <Card.Title>Pilots*</Card.Title>
      <Card.Body>
        <div className="flex justify-end pb-4">
          <FactionSelection value={faction} onChange={setFaction} />
        </div>
        <List variant="compact">
          {data.map(([pilot, stat]) => (
            <List.Item key={pilot}>
              <div className="flex flex-row items-center">
                <ShipIcon
                  ship={stat.ship}
                  className="w-6 text-2xl text-secondary-700"
                />
                <div className="text-lg font-medium">{getPilotName(pilot)}</div>
              </div>
              <Stat>
                <Stat.Label>Percentile:</Stat.Label>
                <Stat.Value>{stat.percentile}</Stat.Value>
              </Stat>
              <Stat>
                <Stat.Label>Performance:</Stat.Label>
                <Stat.Value>{toPercentage(stat.performance)}</Stat.Value>
              </Stat>
              <Stat>
                <Stat.Label>Std. Deviation:</Stat.Label>
                <Stat.Value>{stat.deviation}</Stat.Value>
              </Stat>
              <Stat>
                <Stat.Label>Frequency:</Stat.Label>
                <Stat.Value>
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

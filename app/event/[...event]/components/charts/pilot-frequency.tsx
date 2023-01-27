import { useState } from 'react';

import { Card, FactionSelection, List, ShipIcon } from 'components';
import type { XWSFaction } from 'lib/types';
import { getPilotName, type Ships } from 'lib/get-value';
import { FooterHint, toPercentage } from './shared';

export interface PilotFrequencyProps {
  value: {
    [faction in XWSFaction]: Map<string, { count: number; ship: Ships }>;
  };
  distribution: {
    [faction in XWSFaction]: number;
  };
}

export const PilotFrequency = ({
  value,
  distribution,
}: PilotFrequencyProps) => {
  const [faction, setFaction] = useState<XWSFaction>('rebelalliance');

  const data = Array.from(value[faction].entries()).sort(
    ([, a], [, b]) => b.count - a.count
  );
  const total = distribution[faction];

  return (
    <Card>
      <Card.Title>Pilot Frequency*</Card.Title>
      <Card.Body>
        <div className="flex justify-end pb-4">
          <FactionSelection value={faction} onChange={setFaction} />
        </div>
        <List variant="compact">
          {data.map(([pilot, { count, ship }]) => (
            <List.Item
              key={pilot}
              className="flex flex-row items-center justify-between px-1 text-xs font-medium"
            >
              <div className="flex flex-row items-center">
                <ShipIcon
                  ship={ship}
                  className="w-5 text-xl text-secondary-700"
                />
                {getPilotName(pilot)}
              </div>
              <div className="tabular-nums text-secondary-400">
                {toPercentage(count / total)} ({count})
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

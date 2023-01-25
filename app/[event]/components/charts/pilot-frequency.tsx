import { useState } from 'react';

import { Card, FactionSelection } from 'components';
import { List } from 'components/list';
import type { XWSFaction } from 'lib/types';
import { getPilotName, type Ships } from 'lib/get-value';
import { ShipIcon } from 'components/ship-icon';

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

  const data = Array.from(value[faction].entries());
  const total = distribution[faction];

  return (
    <Card>
      <Card.Title>Pilot Frequency</Card.Title>
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
                <ShipIcon ship={ship} className="w-5 text-xl text-gray-400" />
                {getPilotName(pilot)}
              </div>
              <div>{count}</div>
            </List.Item>
          ))}
        </List>
      </Card.Body>
    </Card>
  );
};

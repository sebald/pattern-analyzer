import { useState } from 'react';

import { Card, Select } from 'components';
import { getAllFactions } from 'lib/get-value';
import { XWSFaction } from 'lib/types';

export interface PilotFrequencyProps {
  value: {
    rebelalliance: Map<string, number>;
    galacticempire: Map<string, number>;
    scumandvillainy: Map<string, number>;
    resistance: Map<string, number>;
    firstorder: Map<string, number>;
    galacticrepublic: Map<string, number>;
    separatistalliance: Map<string, number>;
  };
}

export const PilotFrequency = ({ value }: PilotFrequencyProps) => {
  const [faction, setFaction] = useState('rebelalliance');

  return (
    <Card>
      <Card.Title>Pilot Frequency</Card.Title>
      <div>
        <Select
          size="small"
          aria-label="Faction"
          value={faction}
          onChange={e => setFaction(e.target.value as XWSFaction)}
        >
          {getAllFactions().map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </Card>
  );
};

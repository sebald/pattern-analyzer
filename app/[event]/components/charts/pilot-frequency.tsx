import { useState } from 'react';

import { Card, FactionSelection } from 'components';
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
  const [faction, setFaction] = useState<XWSFaction>('rebelalliance');

  return (
    <Card>
      <Card.Title>Pilot Frequency</Card.Title>
      <Card.Body>
        <FactionSelection value={faction} onChange={setFaction} />
      </Card.Body>
    </Card>
  );
};

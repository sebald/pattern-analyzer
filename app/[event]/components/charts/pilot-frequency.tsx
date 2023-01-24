import { useState } from 'react';
import { Card } from 'components';

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
  const [] = useState('re');

  return (
    <Card>
      <Card.Title>Pilot Frequency</Card.Title>
      <div></div>
    </Card>
  );
};

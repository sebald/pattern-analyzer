'use client';

import { Accordion } from '@/ui';

import { getPilotName } from '@/lib/get-value';
import { type SquadCompositionStats } from '@/lib/stats/details/composition';

// Props
// ---------------
export interface SquadGroupsProps {
  value: SquadCompositionStats['squads'];
}

// Component
// ---------------
export const SquadGroups = ({ value }: SquadGroupsProps) => {
  const data = Object.entries(value);
  data.sort(([, a], [, b]) => b.percentile - a.percentile);

  return (
    <Accordion type="multiple">
      {Object.entries(value).map(([id, {}]) => (
        <Accordion.Item value={id} key={id}>
          <Accordion.Trigger>
            {id.split('.').map(getPilotName).join(', ')}
          </Accordion.Trigger>
          <Accordion.Content>{id}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

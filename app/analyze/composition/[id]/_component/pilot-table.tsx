import { Fragment } from 'react';

import { SquadCompositionStats } from '@/lib/stats/details/composition';
import { PilotImage, Table } from '@/ui';
import { toPercentage } from '@/lib/utils/math.utils';

// Props
// ---------------
export interface PilotTableProps {
  value: SquadCompositionStats['pilot'];
}

// Component
// ---------------
export const PilotTable = ({ value }: PilotTableProps) => {
  return (
    <Table
      cols={[
        'minmax(auto, max-content)',
        '1fr',
        '1fr',
        '1fr',
        '1fr',
        'minmax(90px, 1fr)',
        '85px',
        '85px',
      ]}
      headers={[
        'Pilot',
        'Upgrades',
        'Percentile',
        'Std. Deviation',
        'Winrate',
        'Frequency',
        'Count',
        'Score',
      ]}
    >
      {Object.entries(value).map(([pid, current]) => (
        <Fragment key={pid}>
          <Table.Cell>
            <PilotImage pilot={pid} width={200} height={200} />
          </Table.Cell>
          <Table.Cell>TODO: List all upgrades</Table.Cell>
          <Table.Cell>{toPercentage(current.percentile)}</Table.Cell>
          <Table.Cell>{toPercentage(current.deviation)}</Table.Cell>
          <Table.Cell>
            {current.winrate ? toPercentage(current.winrate) : '-'}
          </Table.Cell>
          <Table.Cell>{toPercentage(current.frequency)}</Table.Cell>
          <Table.Cell>{current.count}</Table.Cell>
          <Table.Cell>score</Table.Cell>
        </Fragment>
      ))}
    </Table>
  );
};

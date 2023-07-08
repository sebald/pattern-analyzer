import { Fragment } from 'react';

import { Card, ShipIcon, Table } from '@/ui';
import type { CompositionStats as CompositionStatsType } from '@/lib/stats/types';
import { toPercentage } from '@/lib/utils/math.utils';

// Props
// ---------------
export interface PilotStatsProps {
  value: { [id: string]: CompositionStatsType };
}

// Component
// ---------------
export const CompositionStats = ({ value }: PilotStatsProps) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Compositions</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table
          cols={['minmax(auto, max-content)', '1fr', '1fr', '1fr', '70px']}
          headers={[
            'Ships',
            'Percentile',
            'Std. Deviation',
            'Winrate',
            'Count',
          ]}
        >
          {Object.entries(value).map(([id, stat]) => (
            <Fragment key={id}>
              <Table.Cell variant="header">
                {stat.ships.map((ship, idx) => (
                  <ShipIcon key={idx} ship={ship} className="w-5 text-xl" />
                ))}
              </Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.percentile)}
              </Table.Cell>
              <Table.Cell variant="number">
                {stat.deviation === 0 ? '-' : toPercentage(stat.deviation)}
              </Table.Cell>
              <Table.Cell variant="number">
                {toPercentage(stat.winrate)}
              </Table.Cell>
              <Table.Cell variant="number">{stat.xws.length}</Table.Cell>
            </Fragment>
          ))}
        </Table>
      </Card.Body>
    </Card>
  );
};

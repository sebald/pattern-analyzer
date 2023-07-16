'use client';

import { Fragment } from 'react';

import { toPercentage } from '@/lib/utils';
import { Collapsible, FactionIcon, Link, ShipIcon, Table } from '@/ui';

import { useCompositionFilter } from './context';
import type { CompositionStatsType } from './types';

// Props
// ---------------
export interface CompositionTableProps {
  value: { [id: string]: CompositionStatsType };
  collapsible?: boolean;
}

// Components
// ---------------
export const CompositionTable = ({
  value,
  collapsible = true,
}: CompositionTableProps) => {
  const { faction = 'all', sort = 'percentile' } = useCompositionFilter();

  const data =
    faction === 'all'
      ? (Object.entries(value) as [string, CompositionStatsType][])
      : Object.entries(value).filter(
          ([_, stat]: [string, CompositionStatsType]) =>
            stat.faction === faction
        );

  data.sort(([, a], [, b]) => {
    const result = (b[sort] || 0) - (a[sort] || 0);

    // Secondary sort by percentile (or deviation if sorted by percentile already)
    return result !== 0
      ? result
      : sort === 'percentile'
      ? b.deviation - a.deviation
      : b.percentile - a.percentile;
  });

  return (
    <Collapsible maxHeight={800} disabled={!collapsible}>
      <Table
        cols={[
          'minmax(auto, max-content)',
          '120px',
          '1fr',
          '1fr',
          '1fr',
          'minmax(90px, 1fr)',
          '85px',
          '85px',
        ]}
        headers={[
          'Ships',
          'Faction',
          'Percentile',
          'Std. Deviation',
          'Winrate',
          'Frequency',
          'Count',
          'Score',
        ]}
        numeration
      >
        {data.map(([id, stat]) => (
          <Fragment key={id}>
            <Table.Cell variant="header">
              <Link
                href={`/analyze/composition/${id}`}
                variant="highlight"
                className="flex flex-row items-center gap-1 lg:gap-2"
              >
                {stat.ships.map((ship, idx) => (
                  <ShipIcon key={idx} ship={ship} className="text-2xl" />
                ))}
              </Link>
            </Table.Cell>
            <Table.Cell>
              <FactionIcon
                faction={stat.faction}
                className="h-5 w-5 text-secondary-700"
              />
            </Table.Cell>
            <Table.Cell variant="number">
              {toPercentage(stat.percentile)}
            </Table.Cell>
            <Table.Cell variant="number">
              {stat.deviation === 0 ? '-' : toPercentage(stat.deviation)}
            </Table.Cell>
            <Table.Cell variant="number">
              {stat.winrate !== null ? toPercentage(stat.winrate) : '-'}
            </Table.Cell>
            <Table.Cell variant="number">
              {toPercentage(stat.frequency)}
            </Table.Cell>
            <Table.Cell variant="number">{stat.count}</Table.Cell>
            <Table.Cell variant="number">{stat.score}</Table.Cell>
          </Fragment>
        ))}
      </Table>
    </Collapsible>
  );
};

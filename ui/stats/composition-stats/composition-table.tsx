'use client';

import { Fragment } from 'react';

import { toPercentage } from '@/lib/utils';
import type { SortOptions } from '@/ui';
import { Collapsible, FactionIcon, Link, ShipIcon, Table } from '@/ui';
import { Folder } from '@/ui/icons';

import type { CompositionStatsType } from './types';

// Props
// ---------------
export interface CompositionTableProps {
  value: { [id: string]: CompositionStatsType };
  collapsible?: boolean;
  filter?: (entry: [string, CompositionStatsType]) => boolean;
  sortBy?: SortOptions;
}

// Component
// ---------------
export const CompositionTable = ({
  value,
  collapsible = true,
  filter,
  sortBy = 'percentile',
}: CompositionTableProps) => {
  let data = Object.entries(value);

  if (filter) {
    data = data.filter(filter);
  }

  data.sort(([, a], [, b]) => {
    const result = (b[sortBy] || 0) - (a[sortBy] || 0);

    // Secondary sort by percentile (or deviation if sorted by percentile already)
    return result !== 0
      ? result
      : sortBy === 'percentile'
      ? b.deviation - a.deviation
      : b.percentile - a.percentile;
  });

  return (
    <Collapsible maxHeight={800} disabled={!collapsible}>
      <Table
        cols={[
          'max-content',
          'max-content',
          '1fr',
          '1fr',
          '1fr',
          '1fr',
          '1fr',
          '1fr',
          'max-content',
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
          'View',
        ]}
        numeration
      >
        {data.map(([id, stat]) => (
          <Fragment key={id}>
            <Table.Cell
              variant="header"
              className="flex w-full items-center gap-1 "
            >
              {stat.ships.map((ship, idx) => (
                <ShipIcon key={idx} ship={ship} className="text-2xl" />
              ))}
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
            <Table.Cell variant="number">{stat.score.toFixed(2)}</Table.Cell>
            <Table.Cell className="justify-center">
              <Link
                href={`/composition/${id}`}
                variant="highlight"
                className="text-primary-800"
              >
                <Folder className="h-5 w-5" />
              </Link>
            </Table.Cell>
          </Fragment>
        ))}
      </Table>
    </Collapsible>
  );
};

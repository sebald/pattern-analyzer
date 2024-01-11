'use client';

import { Collapsible, Link } from '@/ui';
import type { SortOptions } from '@/ui';
import { View } from '@/ui/icons';
import { ShipIcon } from '@/ui/ship-icon';
import { Table } from '@/ui/table';

import { getPilotName } from '@/lib/get-value';
import { toPercentage } from '@/lib/utils';
import type { FactionMap } from '@/lib/stats/types';
import type { XWSFaction } from '@/lib/types';

import { PilotStatsType } from './types';

export interface PilotStatTypeWithFaction extends PilotStatsType {
  faction: XWSFaction;
}

// Props
// ---------------
export interface PilotTableProps {
  value: FactionMap<string, PilotStatsType>;
  collapsible?: boolean;
  filter?: (entry: [string, PilotStatTypeWithFaction]) => boolean;
  sortBy?: SortOptions;
}

// Component
// ---------------
export const PilotTable = ({
  value,
  collapsible = true,
  filter,
  sortBy = 'percentile',
}: PilotTableProps) => {
  let data = Object.entries(value).reduce(
    (acc: [string, PilotStatTypeWithFaction][], [faction, map]) => {
      const entries = Object.entries(map)
        .filter(Boolean)
        .map(([id, stat]) => [id, { ...stat, faction }]) as [
        string,
        PilotStatTypeWithFaction,
      ][];

      return [...acc, ...entries];
    },
    []
  );

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

  const table = (
    <Table
      columns={[
        { children: 'Pilot', width: 'minmax(auto, max-content)' },
        { children: 'Percentile', width: '1fr', variant: 'number' },
        { children: 'Std. Deviation', width: '1fr', variant: 'number' },
        { children: 'Winrate', width: '1fr', variant: 'number' },
        {
          children: 'Frequency',
          width: 'minmax(90px, 1fr)',
          variant: 'number',
        },
        { children: 'Count', width: '85px', variant: 'number' },
        { children: 'Score', width: '85px', variant: 'number' },
        { children: 'View', width: 'max-content' },
      ]}
      numeration
    >
      {data.map(([id, stat]) => (
        <Table.Row key={`${stat.faction}-${id}`}>
          <Table.Cell variant="header">
            <ShipIcon ship={stat.ship} className="w-5 text-xl" />
            <div className="font-semibold">{getPilotName(id) || id}</div>
          </Table.Cell>
          <Table.Cell>{toPercentage(stat.percentile)}</Table.Cell>
          <Table.Cell>
            {stat.deviation === 0 ? '-' : toPercentage(stat.deviation)}
          </Table.Cell>
          <Table.Cell>
            {stat.winrate !== null ? toPercentage(stat.winrate) : '-'}
          </Table.Cell>
          <Table.Cell>{toPercentage(stat.frequency)}</Table.Cell>
          <Table.Cell>{stat.count}</Table.Cell>
          <Table.Cell>{stat.score.toFixed(2)}</Table.Cell>
          <Table.Cell className="justify-center">
            <Link
              href={`/pilot/${id}${
                stat.count <= 25 ? '?small-samples=show' : ''
              }`}
              variant="highlight"
              className="text-primary-800"
            >
              <View className="h-5 w-5" />
            </Link>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );

  return collapsible ? (
    <Collapsible maxHeight={800}>{table}</Collapsible>
  ) : (
    table
  );
};

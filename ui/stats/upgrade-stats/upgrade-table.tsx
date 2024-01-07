'use client';

import { Fragment } from 'react';

import { Collapsible, SortOptions, Table } from '@/ui';

import { getUpgradeName } from '@/lib/get-value';
import type { FactionMapWithAll } from '@/lib/stats/types';
import type { XWSFaction } from '@/lib/types';
import { toPercentage } from '@/lib/utils';

import { UpgradeStatsType } from './types';

export interface UpgradeStatTypeWithFaction extends UpgradeStatsType {
  faction: XWSFaction;
}

// Props
// ---------------
export interface UpgradeTableProps {
  value: FactionMapWithAll<string, UpgradeStatsType>;
  collapsible?: boolean;
  filter?: (entry: [string, UpgradeStatTypeWithFaction]) => boolean;
  sortBy?: SortOptions;
}

// Components
// ---------------
export const UpgradeTable = ({
  value,
  collapsible = true,
  filter,
  sortBy = 'percentile',
}: UpgradeTableProps) => {
  let data = Object.entries(value).reduce(
    (acc: [string, UpgradeStatTypeWithFaction][], [faction, map]) => {
      const entries = Object.entries(map)
        .filter(Boolean)
        .map(([id, stat]) => [id, { ...stat, faction }]) as [
        string,
        UpgradeStatTypeWithFaction,
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
        { children: 'Upgrade', width: 'minmax(auto, max-content)' },
        { children: 'Percentile', width: '1fr' },
        { children: 'Std. Deviation', width: '1fr' },
        { children: 'Winrate', width: '1fr' },
        { children: 'Frequency', width: 'minmax(90px, 1fr)' },
        { children: 'Count', width: '85px' },
        { children: 'Score', width: '85px' },
      ]}
      numeration
    >
      {data.map(([upgrade, stat]) => (
        <Fragment key={`${stat.faction}-${stat.slot}-${upgrade}`}>
          <Table.Cell variant="header">
            <div className="font-semibold">
              {getUpgradeName(upgrade) || upgrade}
            </div>
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
  );

  return collapsible ? (
    <Collapsible maxHeight={375}>{table}</Collapsible>
  ) : (
    table
  );
};

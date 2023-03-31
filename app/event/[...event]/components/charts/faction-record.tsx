import { Fragment } from 'react';

import { Card, Table } from '@/ui';
import { getFactionName } from '@/lib/get-value';
import { XWSFaction } from '@/lib/types';
import { toPercentage } from '@/lib/utils';

import { FACTION_COLORS } from './shared';

// Props
// ---------------
export interface FactionRecordProps {
  value: {
    [Faction in XWSFaction | 'unknown']: {
      ranks: number[];
      records: { wins: number; ties: number; losses: number }[];
      winrate: number;
    };
  };
}

// Component
// ---------------
export const FactionRecord = ({ value }: FactionRecordProps) => {
  const data = Object.entries(value)
    .map(([key, { records, winrate, ranks }]) => {
      const faction = key as XWSFaction | 'unknown';
      const record = records.reduce(
        (acc, rec) => {
          acc.wins = acc.wins + rec.wins;
          acc.ties = acc.ties + rec.ties;
          acc.losses = acc.losses + rec.losses;
          return acc;
        },
        { wins: 0, ties: 0, losses: 0 }
      );
      const games = record.wins + record.ties + record.losses;
      const top = ranks.length ? ranks[0] : 0;

      return {
        faction,
        games,
        record,
        winrate,
        top,
      };
    })
    .filter(({ games }) => games > 0);

  data.sort((a, b) => b.winrate - a.winrate);

  return (
    <Card>
      <Card.Title>Faction Record</Card.Title>
      <Card.Body>
        <Table
          cols={['max-content', 'auto', 'max-content', 'auto', 'auto']}
          headers={['Faction', 'Games', 'Record', 'Winrate', 'TOP']}
          size="relaxed"
        >
          {data.map(({ faction, games, record, winrate, top }) => (
            <Fragment key={faction}>
              <Table.Cell variant="header" className="font-semibold">
                <div
                  className="mr-1 h-2 w-2"
                  style={{ background: FACTION_COLORS[faction] }}
                />
                {faction === 'unknown' ? 'Unknown' : getFactionName(faction)}
              </Table.Cell>
              <Table.Cell>{games}</Table.Cell>
              <Table.Cell>
                {record.wins} / {record.ties} / {record.losses}
              </Table.Cell>
              <Table.Cell>{toPercentage(winrate)}</Table.Cell>
              <Table.Cell>{top > 0 ? `#${top}` : '-'}</Table.Cell>
            </Fragment>
          ))}
        </Table>
        <div className="pt-2 text-center text-sm font-semibold">
          Overall games played:{' '}
          {data.reduce((acc, { games }) => acc + games, 0)}
        </div>
      </Card.Body>
    </Card>
  );
};

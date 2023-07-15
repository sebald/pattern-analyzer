import { Fragment } from 'react';

import { Card, Table } from '@/ui';
import { getFactionName } from '@/lib/get-value';
import type { GameRecord, XWSFaction } from '@/lib/types';
import { FACTION_COLORS, toPercentage } from '@/lib/utils';

// Props
// ---------------
export interface FactionRecordProps {
  value: {
    [Faction in XWSFaction | 'unknown']: {
      top: number;
      record: GameRecord;
      winrate: number | null;
    };
  };
}

// Component
// ---------------
export const FactionRecord = ({ value }: FactionRecordProps) => {
  const data = Object.entries(value)
    .map(([key, { record, winrate, top }]) => {
      const faction = key as XWSFaction | 'unknown';
      const games = record.wins + record.ties + record.losses;

      return {
        faction,
        games,
        record,
        winrate,
        top,
      };
    })
    .filter(({ games }) => games > 0);

  data.sort((a, b) => (b.winrate || 0) - (a.winrate || 0));

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
              <Table.Cell>
                {winrate !== null ? toPercentage(winrate) : '-'}
              </Table.Cell>
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

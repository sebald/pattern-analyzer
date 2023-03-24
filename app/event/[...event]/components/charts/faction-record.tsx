import { Card, Table } from '@/components';
import { getFactionName } from '@/lib/get-value';
import { XWSFaction } from '@/lib/types';
import { Fragment } from 'react';
import { FACTION_COLORS, toPercentage } from './shared';

// Props
// ---------------
export interface FactionRecordProps {
  value: {
    [Faction in XWSFaction | 'unknown']: {
      records: { wins: number; ties: number; losses: number }[];
      winrate: number;
    };
  };
}

// Component
// ---------------
export const FactionRecord = ({ value }: FactionRecordProps) => {
  const data = Object.entries(value)
    .map(([key, { records, winrate }]) => {
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

      return {
        faction,
        games,
        record,
        winrate,
      };
    })
    .filter(({ games }) => games > 0);

  data.sort((a, b) => b.winrate - a.winrate);

  return (
    <Card>
      <Card.Title>Faction Record</Card.Title>
      <Card.Body>
        <Table
          cols={['max-content', '1fr', '1fr', '1fr']}
          headers={['Faction', 'Games', 'Record', 'Winrate']}
          size="relaxed"
        >
          {data.map(({ faction, games, record, winrate }) => (
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
            </Fragment>
          ))}
        </Table>
      </Card.Body>
    </Card>
  );
};

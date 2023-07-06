'use client';

import { Card } from '@/ui';
import type { XWSFaction } from '@/lib/types';
import { FACTION_ABBR, FACTION_COLORS, toPercentage } from '@/lib/utils';
import { ResponsiveBar } from '@nivo/bar';
import { getFactionName } from '@/lib/get-value';

// Props
// ---------------
export interface FactionWinrateProps {
  value: {
    [Faction in XWSFaction | 'unknown']: {
      ranks: number[];
    };
  };
  total: number;
}

// Component
// ---------------
export const FactionVictories = ({ value, total }: FactionWinrateProps) => {
  const data = Object.entries(value)
    // Remove "uknown"
    .filter(([key]) => key !== 'unknown')
    .map(([key, { ranks }]) => {
      const faction = key as XWSFaction;
      const wins = ranks.filter(rank => rank === 1).length;
      return {
        faction,
        wins,
        percentage: wins / total,
      };
    });

  return (
    <Card>
      <Card.Header>
        <Card.Title>Faction Victories</Card.Title>
      </Card.Header>
      <div className="h-72">
        <ResponsiveBar
          data={[...data].sort((a, b) => a.wins - b.wins)}
          indexBy="faction"
          keys={['percentage']}
          minValue={0}
          valueFormat={toPercentage}
          axisLeft={{
            format: toPercentage,
          }}
          axisBottom={{
            format: (faction: XWSFaction) => FACTION_ABBR[faction],
          }}
          colors={({ data }) => FACTION_COLORS[data.faction]}
          padding={0.2}
          margin={{ top: 10, right: 10, bottom: 20, left: 45 }}
          isInteractive={false}
          animate={false}
        />
      </div>
      <Card.Footer>
        <div className="grid grid-cols-2 gap-2 px-1 pt-2 lg:grid-cols-3">
          {data.map(({ faction, wins }) => (
            <div
              key={faction}
              className="flex items-center gap-1 text-xs text-secondary-900"
            >
              <div
                className="h-2 w-2"
                style={{ background: FACTION_COLORS[faction] }}
              />
              <div className="font-medium">{getFactionName(faction)}:</div>
              {wins}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

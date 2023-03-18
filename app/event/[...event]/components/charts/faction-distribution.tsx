'use client';

import { ResponsiveBar } from '@nivo/bar';

import { getFactionName } from '@/lib/get-value';
import { XWSFaction } from '@/lib/types';
import { Card } from '@/components';

import { FACTION_ABBR, FACTION_COLORS, toPercentage } from './shared';

// Props
// ---------------
export interface FactionDistributionProps {
  value: { [key in XWSFaction | 'unknown']: number };
  total: number;
}

// Component
// ---------------
export const FactionDistribution = ({
  value,
  total,
}: FactionDistributionProps) => {
  const data = Object.entries(value)
    .map(([key, count]) => {
      const faction = key as XWSFaction | 'unknown';
      return {
        faction,
        frequency: count / total,
        count,
      };
    })
    // Remove "uknown" if everything was parsed!
    .filter(({ faction, count }) => (faction !== 'unknown' ? true : count > 0));

  return (
    <Card>
      <Card.Title>Faction Distribution</Card.Title>
      <div className="h-60 md:h-72">
        <ResponsiveBar
          data={data.sort((a, b) => a.count - b.count)}
          indexBy="faction"
          keys={['frequency']}
          minValue={0}
          valueFormat={toPercentage}
          axisLeft={{
            format: toPercentage,
          }}
          axisBottom={{
            format: (faction: XWSFaction | 'unknown') => FACTION_ABBR[faction],
          }}
          colors={({ data }) => FACTION_COLORS[data.faction]}
          padding={0.2}
          margin={{ top: 10, right: 20, bottom: 20, left: 50 }}
          isInteractive={false}
          animate
        />
      </div>
      <Card.Footer>
        <div className="grid grid-cols-2 gap-2 px-1 pt-2 lg:grid-cols-3">
          {data.map(({ faction, count }) => (
            <div
              key={faction}
              className="flex items-center gap-1 text-xs text-secondary-900"
            >
              <div
                className="h-2 w-2"
                style={{ background: FACTION_COLORS[faction] }}
              />
              <div className="font-medium">
                {faction === 'unknown' ? 'Unknown' : getFactionName(faction)}:
              </div>
              {count}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

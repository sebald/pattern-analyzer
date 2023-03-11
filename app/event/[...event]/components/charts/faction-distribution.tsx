'use client';

import { ResponsivePie } from '@nivo/pie';

import { getFactionName } from 'lib/get-value';
import { XWSFaction } from 'lib/types';
import { Card } from 'components';
import { FACTION_COLORS, toPercentage } from './shared';

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
  const data = (Object.entries(value) as [XWSFaction | 'unknown', number][])
    .map(([faction, count]) => {
      // Remove unknown if 0
      if (faction === 'unknown' && count === 0) {
        return null;
      }

      return {
        id: faction === 'unknown' ? 'Unknown' : getFactionName(faction),
        label: faction, // Unused? Shouldn't this be the other way around!?
        value: count,
        color: FACTION_COLORS[faction],
      };
    })
    .filter(Boolean) as {
    id: string;
    label: XWSFaction | 'unknown';
    value: number;
    color: string;
  }[];

  return (
    <Card>
      <Card.Title>Faction Distribution</Card.Title>
      <div className="h-60 md:h-72">
        <ResponsivePie
          data={data}
          valueFormat={value => toPercentage(value / total)}
          isInteractive={false}
          margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
          colors={{ datum: 'data.color' }}
          activeOuterRadiusOffset={8}
          innerRadius={0.6}
          padAngle={0.5}
          cornerRadius={5}
          animate
        />
      </div>
      <Card.Footer>
        <div className="grid grid-cols-2 gap-2 px-1 pt-2 lg:grid-cols-3">
          {data.map(({ id, value, color }) => (
            <div
              key={id}
              className="flex items-center gap-1 text-xs text-secondary-900"
            >
              <div className="h-2 w-2" style={{ background: color }} />
              <div className="font-medium">{id}:</div>
              {value}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

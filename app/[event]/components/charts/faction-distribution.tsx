'use client';

import { getFactionName } from 'lib/get-value';
import { XWSFaction } from 'lib/types';
import { Card } from 'components';
import { ResponsivePie } from '@nivo/pie';

// Helpers
// ---------------
const FACTION_COLORS: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: '#f87171',
  galacticempire: '#60a5fa',
  scumandvillainy: '#fcd34d',
  resistance: '#fdba74',
  firstorder: '#ef4444',
  galacticrepublic: '#fecaca',
  separatistalliance: '#93c5fd',
  unknown: '#cbd5e1',
};

// Props
// ---------------
export interface FactionDistributionProps {
  value: { [key in XWSFaction | 'unknown']: number };
}

// Component
// ---------------
export const FactionDistribution = ({ value }: FactionDistributionProps) => {
  const data = (
    Object.entries(value) as [XWSFaction | 'unknown', number][]
  ).map(([faction, count]) => {
    return {
      id: faction === 'unknown' ? 'Unknown' : getFactionName(faction),
      label: faction, // Unused? Shouldn't this be the other way around!?
      value: count,
      color: FACTION_COLORS[faction],
    };
  });
  const total = Object.values(value).reduce((t, val) => t + val, 0);

  return (
    <Card>
      <Card.Title>Faction Distribution</Card.Title>
      <div className="h-72">
        <ResponsivePie
          data={data}
          valueFormat={value =>
            new Intl.NumberFormat('default', {
              style: 'percent',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value / total)
          }
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
        <div className="grid grid-cols-3 gap-1 px-2 pt-2">
          {data.map(({ id, value, color }) => (
            <div
              key={id}
              className="flex items-center gap-0.5 text-xs text-secondary-900"
            >
              <div className="h-2 w-2" style={{ background: color }} />
              {id}: {value}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

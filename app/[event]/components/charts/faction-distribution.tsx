'use client';

import { ResponsivePie } from '@nivo/pie';

import { getFactionName } from 'lib/get-value';
import { XWSFaction } from 'lib/types';
import { Card } from 'components';
import { toPercentage } from './shared';

// Helpers
// ---------------
const FACTION_COLORS: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: '#fecaca',
  galacticempire: '#93c5fd',
  scumandvillainy: '#fde68a',
  resistance: '#fdba74',
  firstorder: '#f87171',
  galacticrepublic: '#fda4af',
  separatistalliance: '#a5b4fc',
  unknown: '#e2e8f0',
};

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
        <div className="grid grid-cols-2 gap-1 px-2 pt-2 lg:grid-cols-3">
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

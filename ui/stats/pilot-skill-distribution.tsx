'use client';

import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';

import { Card } from '@/ui';
import { weightedAverage } from '@/lib/utils';

// Props
// ---------------
export interface PilotSkillDistributionProps {
  value: { [Cost in 0 | 1 | 2 | 3 | 4 | 5 | 6]: number };
}

// Component
// ---------------
export const PilotSkillDistribution = ({
  value,
}: PilotSkillDistributionProps) => {
  const data = Object.entries(value).map(([cost, count]) => ({
    x: Number(cost),
    y: count,
  }));

  const total = Object.values(value).reduce((t, val) => {
    t = t + val;
    return t;
  }, 0);

  const largeValue = Object.values(value).some(val => val > 1000);

  return (
    <Card>
      <Card.Title>Pilot Initiative Distribution</Card.Title>
      <div className="h-72">
        <ResponsiveLine
          data={[
            {
              id: 'pilot skill',
              data,
            },
          ]}
          curve="monotoneX"
          enablePointLabel
          enableArea
          pointSize={10}
          defs={[
            linearGradientDef('gradient', [
              { offset: 0, color: '#8490db' },
              { offset: 100, color: '#d0dcf5' },
            ]),
          ]}
          colors="#8490db"
          fill={[{ match: '*', id: 'gradient' }]}
          margin={{
            top: 20,
            right: 30,
            bottom: 20,
            left: largeValue ? 40 : 30,
          }}
          isInteractive={false}
          animate={false}
        />
      </div>
      <div className="text-center text-sm font-semibold">
        Average Pilot Initiative: {weightedAverage(value, total).toFixed(1)}
      </div>
    </Card>
  );
};

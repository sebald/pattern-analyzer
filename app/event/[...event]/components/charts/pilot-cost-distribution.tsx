import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';

import { Card } from '@/components';
import { calcWeightedAverage } from './shared';

// Props
// ---------------
export interface PilotCostDistributionProps {
  value: { [Cost in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9]: number };
}

// Component
// ---------------
export const PilotCostDistribution = ({
  value,
}: PilotCostDistributionProps) => {
  const data = Object.entries(value).map(([cost, count]) => ({
    x: Number(cost),
    y: count,
  }));

  const total = Object.values(value).reduce((t, val) => {
    t = t + val;
    return t;
  }, 0);

  return (
    <Card>
      <Card.Title>Pilot Cost Distribution</Card.Title>
      <div className="h-72">
        <ResponsiveLine
          data={[
            {
              id: 'pilot cost',
              data,
            },
          ]}
          curve="monotoneX"
          enablePointLabel
          enableArea
          pointSize={10}
          xScale={{
            type: 'linear',
            min: 1,
            max: 'auto',
          }}
          defs={[
            linearGradientDef('gradient', [
              { offset: 0, color: '#8490db' },
              { offset: 100, color: '#d0dcf5' },
            ]),
          ]}
          colors="#8490db"
          fill={[{ match: '*', id: 'gradient' }]}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          animate
        />
      </div>
      <div className="text-center text-sm font-semibold">
        Average Pilot Cost: {calcWeightedAverage(value, total).toFixed(1)}
      </div>
    </Card>
  );
};

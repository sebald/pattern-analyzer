'use client';

import type { ReactNode } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

import { Card } from '@/ui';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { getPilotName } from '@/lib/get-value';

// Helpers
// ---------------
const Tooltip = ({ children }: { children?: ReactNode }) => (
  <div className="rounded border border-secondary-100 bg-white px-3 py-1 text-sm shadow-sm shadow-secondary-600">
    {children}
  </div>
);

// Props
// ---------------
export interface PilotPerformancepmProps {
  value: {
    [pids: string]: {
      count: number;
      percentile: number;
      deviation: number;
    };
  };
  baseline: {
    percentile: number;
    count: number;
  };
}

// Component
// ---------------
export const PilotPerformance = ({
  value,
  baseline,
}: PilotPerformancepmProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  const data = Object.entries(value)
    .filter(([, stat]) => {
      if (smallSamples === 'hide') {
        return stat.count >= 5;
      }

      return true;
    })
    .map(([id, stat]) => ({
      pilots: id,
      x: stat.percentile,
      y: stat.count / baseline.count,
      count: stat.count,
    }));

  return (
    <Card>
      <div className="h-[448px]">
        <ResponsiveScatterPlot
          data={[{ id: 'squadmates', data }]}
          xScale={{ type: 'linear', min: 0, max: 1 }}
          xFormat=">-.2%"
          yScale={{ type: 'linear', min: 0, max: 1 }}
          yFormat=">-.2%"
          tooltip={({ node }) => (
            <Tooltip>
              <strong>
                {node.data.pilots.split('.').map(getPilotName).join(', ')}:
              </strong>{' '}
              <span className="text-secondary-700">{node.formattedX}</span>
            </Tooltip>
          )}
          nodeSize={12}
          blendMode="multiply"
          colors="#8490db"
          enableGridY={false}
          axisRight={null}
          axisTop={null}
          axisLeft={{
            legend: 'Frequency',
            legendPosition: 'middle',
            legendOffset: -50,
            format: '>-.0%',
          }}
          axisBottom={{
            legend: 'Percentile',
            legendPosition: 'middle',
            legendOffset: 40,
            format: '>-.0%',
          }}
          margin={{
            top: 20,
            right: 30,
            bottom: 50,
            left: 60,
          }}
          animate={false}
        />
      </div>
    </Card>
  );
};

'use client';

import { ResponsiveSwarmPlot } from '@nivo/swarmplot';

import { Card } from '@/ui';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';

// Props
// ---------------
export interface PilotSetsProps {
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
export const PilotSets = ({ value, baseline }: PilotSetsProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  const data = Object.entries(value)
    .filter(([id, stat]) => {
      if (smallSamples === 'hide') {
        return stat.count >= 5;
      }

      return true;
    })
    .map(([id, stat]) => ({
      id,
      group: 'squadmates',
      percentile: stat.percentile,
      frequency: stat.count / baseline.count,
      count: stat.count,
    }));

  /**
   * scatter plot where x = frequency (baseline.count/value.count), y = percentile
   * size of dot = count?
   */
  console.log(data);

  return (
    <Card>
      <div className="h-96">
        <ResponsiveSwarmPlot
          data={data}
          groups={['squadmates']}
          value="percentile"
          valueScale={{ type: 'linear', min: 0, max: 1 }}
          size={{
            key: 'frequency',
            values: [0, 1],
            sizes: [12, 60],
          }}
          spacing={8}
          layout="horizontal"
          colors="#8490db"
          animate={false}
        />
      </div>
    </Card>
  );
};

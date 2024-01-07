'use client';

import { ResponsiveSwarmPlot } from '@nivo/swarmplot';

import { Card } from '@/ui';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { getPilotName } from '@/lib/get-value';
import { theme } from '@/ui/stats/theme';
import { Tooltip } from '@/ui/stats/tooltip';

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
    .filter(([, stat]) => {
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

  return (
    <Card>
      <Card.Title>Performance of Squadmate Sets</Card.Title>
      <div className="h-[448px]">
        <ResponsiveSwarmPlot
          data={data}
          theme={theme}
          groups={['squadmates']}
          value="percentile"
          valueScale={{ type: 'linear', min: 0, max: 1 }}
          valueFormat=">-.2%"
          tooltip={({ id, formattedValue }) => (
            <Tooltip>
              <strong>{id.split('.').map(getPilotName).join(', ')}:</strong>{' '}
              <span className="text-secondary-700">{formattedValue}</span>
            </Tooltip>
          )}
          size={{
            key: 'frequency',
            values: [0, 1],
            sizes: [12, 60],
          }}
          spacing={6}
          layout="horizontal"
          forceStrength={4}
          colors="#8490db"
          enableGridY={false}
          axisLeft={null}
          axisRight={null}
          axisTop={null}
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
            left: 30,
          }}
          animate={false}
        />
      </div>
    </Card>
  );
};

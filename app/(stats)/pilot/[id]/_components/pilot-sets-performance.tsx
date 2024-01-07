'use client';

import { ResponsiveScatterPlot } from '@nivo/scatterplot';

import { Card } from '@/ui';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { theme } from '@/ui/stats/theme';
import { Tooltip } from '@/ui/stats/tooltip';
import { getPilotName } from '@/lib/get-value';

// Props
// ---------------
export interface PilotPerformanceProps {
  className?: string;
  value: {
    [pids: string]: {
      count: number;
      percentile: number;
      deviation: number;
    };
  };
  baseline: {
    count: number;
  };
}

// Component
// ---------------
export const PilotPerformance = ({
  className,
  value,
  baseline,
}: PilotPerformanceProps) => {
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
    <Card className={className}>
      <Card.Title>Performance & Usage of Squadmates</Card.Title>
      <div className="h-96">
        <ResponsiveScatterPlot
          data={[{ id: 'squadmates', data }]}
          theme={theme}
          xScale={{ type: 'linear', min: 0, max: 1 }}
          xFormat=">-.2%"
          yScale={{ type: 'symlog', min: 0, max: 1 }}
          yFormat=">-.2%"
          tooltip={({ node }) => (
            <Tooltip>
              <strong className="block pb-1 text-base">
                {node.data.pilots.split('.').map(getPilotName).join(', ')}:
              </strong>
              <ul className="list-inside list-disc">
                <li>
                  <span className="font-semibold">Percentile:</span>{' '}
                  {node.formattedX}
                </li>
                <li>
                  <span className="font-semibold">Frequency:</span>{' '}
                  {node.formattedY}
                </li>
              </ul>
            </Tooltip>
          )}
          nodeSize={16}
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
      <Card.Footer className="px-2 py-1 text-sm">
        <strong>Note:</strong> Frequency scale is not linear in order to reduce
        clutter.
      </Card.Footer>
    </Card>
  );
};

'use client';

import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import type { ScatterPlotNodeProps } from '@nivo/scatterplot';

import { Card } from '@/ui';
import { theme } from '@/ui/stats/theme';
import type { SquadCompositionStats } from '@/lib/stats/details/composition';
import { average, round } from '@/lib/utils/math.utils';
import { Tooltip } from '@/ui/stats/tooltip';

// Helper
// ---------------
type SquadSize = 3 | 4 | 5 | 6 | 7 | 8;

const NodeComponent = ({
  node,
  blendMode,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
}: ScatterPlotNodeProps<{ size: string; x: number; y: number }>) => (
  <g transform={`translate(${node.x},${node.y})`}>
    <circle
      r={node.size / 2}
      fill="#f1f5fc"
      stroke="#5155b1"
      strokeWidth={2}
      style={{ mixBlendMode: blendMode }}
      onMouseEnter={event => onMouseEnter?.(node, event)}
      onMouseMove={event => onMouseMove?.(node, event)}
      onMouseLeave={event => onMouseLeave?.(node, event)}
      onClick={event => onClick?.(node, event)}
    />
    <text
      y={5}
      textAnchor="middle"
      stroke="#5155b1"
      fontSize={12}
      strokeWidth={1}
    >
      {node.data.size}
    </text>
  </g>
);

// Props
// ---------------
export interface PilotSquadSizePerformanceProps {
  className?: string;
  value: SquadCompositionStats['squads'];
}

// Component
// ---------------
export const PilotSquadSizePerformance = ({
  className,
  value,
}: PilotSquadSizePerformanceProps) => {
  let total = 0;
  const result: {
    [size in SquadSize]: { percentiles: number[]; count: number };
  } = {
    3: { percentiles: [], count: 0 },
    4: { percentiles: [], count: 0 },
    5: { percentiles: [], count: 0 },
    6: { percentiles: [], count: 0 },
    7: { percentiles: [], count: 0 },
    8: { percentiles: [], count: 0 },
  };

  Object.entries(value).forEach(([pilots, stat]) => {
    const size = pilots.split('.').length as SquadSize;
    if (size < 3 || size > 8) {
      return;
    }

    result[size].count += 1;
    result[size].percentiles.push(stat.percentile);

    total += 1;
  });

  const data = Object.entries(result)
    .filter(([, stat]) => stat.count)
    .map(([size, stat]) => ({
      size,
      x: average(stat.percentiles, 4),
      y: round(stat.count / total, 4),
    }));

  return (
    <Card className={className}>
      <Card.Title>Squad Sizes</Card.Title>
      <div className="h-96">
        <ResponsiveScatterPlot
          data={[{ id: 'sizes', data }]}
          theme={theme}
          xScale={{ type: 'linear', min: 0, max: 1 }}
          xFormat=">-.2%"
          yScale={{ type: 'linear', min: 0, max: 1 }}
          yFormat=">-.2%"
          tooltip={({ node }) => (
            <Tooltip>
              <ul>
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
          nodeSize={32}
          nodeComponent={NodeComponent}
          enableGridY={false}
          axisRight={null}
          axisTop={null}
          axisLeft={{
            legend: 'Frequency',
            legendPosition: 'middle',
            legendOffset: -50,
            format: '>-.0%',
            tickValues: 5,
          }}
          axisBottom={{
            legend: 'Percentile',
            legendPosition: 'middle',
            legendOffset: 40,
            format: '>-.0%',
            tickValues: 5,
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
      <Card.Footer className="px-1 pt-2 text-xs font-medium">
        Note: Squad size is omitted if there is not at least one occurance.
      </Card.Footer>
    </Card>
  );
};

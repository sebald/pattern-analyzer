'use client';

import { BarCustomLayer, ResponsiveBar } from '@nivo/bar';

import { Card } from '@/ui';
import { toPercentage, weightedAverage } from '@/lib/utils';

import { COLOR_MAP } from './utils';

// Props
// ---------------
export interface SquadSizeProps {
  value: {
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
  };
  total: number;
}

const sideLabel: BarCustomLayer<{
  size: '3' | '4' | '5' | '6' | '7' | '8';
  count: number;
}> = ({ bars, labelSkipWidth }) => (
  <g>
    {bars.map(({ width, height, y, data }) => {
      if (width >= labelSkipWidth) {
        return null;
      }

      return (
        <text
          key={`${data.id}-${data.indexValue}`}
          transform={`translate(${width + 10}, ${y + height / 2})`}
          textAnchor="left"
          dominantBaseline="central"
          style={{
            fontFamily: 'sans-serif',
            fontSize: '11px',
            fill: 'rgb(51, 51, 51)',
            pointerEvents: 'none',
          }}
        >
          {data.formattedValue}
        </text>
      );
    })}
  </g>
);

// Components
// ---------------
export const SquadSize = ({ value, total }: SquadSizeProps) => {
  const data = (
    Object.entries(value) as ['3' | '4' | '5' | '6' | '7' | '8', number][]
  )
    .map(([size, count]) => ({
      size,
      count,
    }))
    // Start with lowest ...
    .reverse();

  return (
    <Card>
      <Card.Title>Squad Size</Card.Title>
      <div className="h-72">
        <ResponsiveBar
          data={data}
          indexBy="size"
          keys={['count']}
          valueFormat={value =>
            value > 0 ? `${value} (${toPercentage(value / total)})` : ''
          }
          labelSkipWidth={65}
          layers={[
            'grid',
            'axes',
            'bars',
            'markers',
            'legends',
            'annotations',
            sideLabel,
          ]}
          layout="horizontal"
          enableGridY={false}
          enableGridX={true}
          colors={({ data }) => COLOR_MAP[data.size]}
          padding={0.2}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          isInteractive={false}
          animate={false}
        />
      </div>
      <div className="text-center text-sm font-semibold">
        Average Ship Count: {weightedAverage(value, total).toFixed(1)}
      </div>
    </Card>
  );
};

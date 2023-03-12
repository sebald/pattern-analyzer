import { BarCustomLayer, ResponsiveBar } from '@nivo/bar';

import { Card } from '@/components';
import { calcWeightedAverage, toPercentage } from './shared';

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

const COLOR_MAP = {
  3: '#e5ecfa',
  4: '#d0dcf5',
  5: '#b4c5ed',
  6: '#96a6e3',
  7: '#8490db',
  8: '#6167ca',
};

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
          valueFormat={value => `${value} (${toPercentage(value / total)})`}
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
          animate
          isInteractive={false}
        />
      </div>
      <div className="text-center text-sm font-semibold">
        Average Ship Count: {calcWeightedAverage(value, total).toFixed(1)}
      </div>
    </Card>
  );
};

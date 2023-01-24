import { ResponsiveBar } from '@nivo/bar';

import { Card } from 'components';

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

export const SquadSize = ({ value, total }: SquadSizeProps) => {
  const data = Object.entries(value)
    .map(([size, count]) => ({
      size,
      [size]: count,
    }))
    // Start with lowest ...
    .reverse();

  // Calculate weighted mean
  const weightedMean = (
    Object.entries(value).reduce((mean, [size, count]) => {
      mean = mean + Number(size) * count;
      return mean;
    }, 0) / total
  ).toFixed(2);
  console.log(data);
  return (
    <Card>
      <Card.Title>Squad Size*</Card.Title>
      <div className="h-72">
        <ResponsiveBar
          data={data}
          indexBy="size"
          keys={['3', '4', '5', '6', '7', '8']}
          markers={[
            {
              axis: 'x',
              value: weightedMean,
              lineStyle: { stroke: '#475569', strokeWidth: 1 },
              textStyle: { fontSize: 12 },
              legend: `average ship count`,
              legendOrientation: 'horizontal',
              legendPosition: 'bottom-right',
            },
          ]}
          layout="horizontal"
          enableGridY={false}
          enableGridX={true}
          colors={{ scheme: 'blue_purple' }}
        />
      </div>
    </Card>
  );
};

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

export const SquadSize = ({ value }: SquadSizeProps) => {
  const data = Object.entries(value)
    .map(([size, count]) => ({
      size,
      [size]: count,
    }))
    // Start with lowest ...
    .reverse();

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
              axis: 'y',
              value: 300,
              lineStyle: { stroke: 'rgba(0, 0, 0, .35)', strokeWidth: 2 },
              legend: 'y marker at 300',
              legendOrientation: 'vertical',
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

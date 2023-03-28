'use client';

import { useState } from 'react';
import useMedia from 'react-use/lib/useMedia';
import type { AxisTickProps } from '@nivo/axes';
import { BarCustomLayer, BarSvgProps, ResponsiveBar } from '@nivo/bar';

import { Card, FactionSelection, Select, ShipText } from '@/components';
import { getStandardShips } from '@/lib/get-value';
import type { XWSFaction } from '@/lib/types';

import { COLOR_MAP, toPercentage, type ShipStatData } from './shared';

// Helpers
// ---------------
const ShipIcon = ({ ship }: { ship: string }) => (
  <ShipText
    ship={ship}
    textAnchor="middle"
    dominantBaseline="middle"
    style={{
      fill: 'rgb(51, 51, 51)',
      fontSize: 20,
    }}
  />
);

const barLabel: BarCustomLayer<{ frequency: number }> = ({
  bars,
  labelSkipWidth,
}) => (
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
            fill: '#0f172a',
            pointerEvents: 'none',
          }}
        >
          {data.formattedValue}
        </text>
      );
    })}
  </g>
);

// Props
// ---------------
export interface ChassisDistributionProps {
  value: { [key in XWSFaction]: Map<string, ShipStatData> };
}

// Component
// ---------------
export const ChassisDistribution = ({ value }: ChassisDistributionProps) => {
  const [faction, setFaction] = useState<XWSFaction>('rebelalliance');
  const [sort, setSort] = useState<'ship' | 'frequency'>('frequency');

  const data = getStandardShips(faction).map(ship => {
    const stats = value[faction].get(ship) || {
      count: 0,
      lists: 0,
      frequency: 0,
    };

    return {
      ship,
      ...stats,
    };
  });

  // Configure chart based on windows size
  const isWide = useMedia('(min-width: 1024px)');
  const chartConfig = (
    isWide
      ? {
          axisLeft: {
            format: toPercentage,
          },
          axisBottom: {
            renderTick: (tick: AxisTickProps<string>) => (
              <g transform={`translate(${tick.x},${tick.y + 14})`}>
                <ShipIcon ship={tick.value} />
              </g>
            ),
          },
        }
      : {
          layout: 'horizontal',
          axisLeft: {
            renderTick: (tick: AxisTickProps<string>) => (
              <g transform={`translate(${tick.x - 16},${tick.y})`}>
                <ShipIcon ship={tick.value} />
              </g>
            ),
          },
          axisBottom: {
            format: toPercentage,
          },
          labelSkipWidth: 65,
          layers: [
            'grid',
            'axes',
            'bars',
            'markers',
            'legends',
            'annotations',
            barLabel,
          ],
          enableGridY: false,
          enableGridX: true,
        }
  ) as Omit<BarSvgProps<(typeof data)[number]>, 'width' | 'height' | 'data'>;

  data.sort((a, b) => {
    // sort from top to bottom in vertical mode
    const { first, second } = isWide
      ? {
          first: a,
          second: b,
        }
      : {
          first: b,
          second: a,
        };

    if (sort === 'ship') {
      return first.ship.localeCompare(second.ship);
    }

    return first.frequency - second.frequency;
  });

  return (
    <Card>
      <Card.Title>Chassis Distribution</Card.Title>
      <div className="flex justify-end gap-3 pb-4">
        <FactionSelection value={faction} onChange={setFaction} />
        <Select
          size="small"
          value={sort}
          onChange={e => setSort(e.target.value as any)}
        >
          <Select.Option value="ship">By Name</Select.Option>
          <Select.Option value="frequency">By Frequency</Select.Option>
        </Select>
      </div>
      <div className="h-[600px] lg:h-72">
        <ResponsiveBar
          data={data}
          indexBy="ship"
          keys={['frequency']}
          minValue={0}
          maxValue={1}
          valueFormat={value => (value > 0 ? toPercentage(value) : '')}
          {...chartConfig}
          labelTextColor={({ data }) =>
            data.data.frequency >= 0.8 ? '#f1f5fc' : '#0f172a'
          }
          colors={({ data }) => {
            if (data.frequency >= 0.9) {
              return COLOR_MAP[8];
            }

            if (data.frequency >= 0.8) {
              return COLOR_MAP[7];
            }

            if (data.frequency >= 0.6) {
              return COLOR_MAP[6];
            }

            if (data.frequency >= 0.4) {
              return COLOR_MAP[5];
            }

            if (data.frequency >= 0.2) {
              return COLOR_MAP[4];
            }

            return COLOR_MAP[3];
          }}
          padding={0.3}
          margin={{ top: 10, right: 10, bottom: 25, left: 45 }}
          isInteractive={false}
          animate={false}
        />
      </div>
    </Card>
  );
};

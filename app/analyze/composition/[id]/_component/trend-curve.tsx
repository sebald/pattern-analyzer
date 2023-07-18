'use client';

import { toPercentage } from '@/lib/utils';
import { formatMonth } from '@/lib/utils/date.utils';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';

// Props
// ---------------
export interface TrendCurveProps {
  value: {
    /**
     * Date format YYYY-MM
     */
    date: string;
    count: number;
    percentile: number;
  }[];
}

// Components
// ---------------
export const TrendCurve = ({ value }: TrendCurveProps) => {
  const data = value.map(({ date, percentile, count }) => ({
    x: date,
    y: percentile,
    count,
  }));

  return (
    <div className="h-64">
      <ResponsiveLine
        data={[
          {
            id: 'squad trend',
            data,
          },
        ]}
        curve="monotoneX"
        axisBottom={{
          format: formatMonth,
        }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 1,
        }}
        axisLeft={{ tickValues: 5, format: toPercentage }}
        pointLabel={({ y }) => toPercentage(y as number)}
        enablePointLabel
        enableArea
        enableGridX={false}
        pointSize={8}
        defs={[
          linearGradientDef('gradient', [
            { offset: 0, color: '#5155b1' },
            { offset: 100, color: '#96a6e3' },
          ]),
        ]}
        colors="#5155b1"
        fill={[{ match: '*', id: 'gradient' }]}
        margin={{ top: 15, right: 30, bottom: 30, left: 40 }}
        isInteractive={false}
        animate={false}
      />
    </div>
  );
};

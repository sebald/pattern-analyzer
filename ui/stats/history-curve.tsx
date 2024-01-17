'use client';

import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';

import { round, toPercentage } from '@/lib/utils/math.utils';
import {
  formatMonth,
  fromDate,
  monthRange,
  today,
} from '@/lib/utils/date.utils';

import { theme } from './theme';

// Props
// ---------------
export interface HistoryCurveProps {
  /**
   * Date format 'YYYY-MM-DD'
   */
  from: string;
  /**
   * Date format 'YYYY-MM-DD'
   */
  to?: string;
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
export const HistoryCurve = ({ from, to, value }: HistoryCurveProps) => {
  const range = monthRange(fromDate(from), to ? fromDate(to) : today());
  const data = range.map(month => {
    const datum = value.find(v => v.date === month);
    return {
      x: month,
      y: datum?.percentile,
      count: datum?.count || 0,
    };
  });

  return (
    <div className="grid h-64 auto-cols-fr">
      <ResponsiveLine
        data={[
          {
            id: 'squad history',
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
        axisLeft={{
          tickValues: 3,
          format: toPercentage,
          legend: <tspan style={{ fontWeight: 700 }}>Percentile</tspan>,
          legendPosition: 'middle',
          legendOffset: -45,
        }}
        theme={theme}
        pointLabel={data =>
          `${toPercentage(data.y as number)} (${(data as any).count})`
        }
        pointSymbol={({ datum }) => (
          <circle
            r={Math.min(round(5 * Math.max(Math.log(datum.count), 1), 0), 15)}
            fill="#5155b1"
            style={{ pointerEvents: 'none' }}
          />
        )}
        pointLabelYOffset={-18}
        enablePointLabel
        enableArea
        enableGridX={false}
        defs={[
          linearGradientDef('gradient', [
            { offset: 0, color: '#8490db' },
            { offset: 100, color: '#d0dcf5' },
          ]),
        ]}
        colors="#5155b1"
        fill={[{ match: '*', id: 'gradient' }]}
        margin={{ top: 30, right: 30, bottom: 30, left: 60 }}
        isInteractive={false}
        animate={false}
      />
    </div>
  );
};

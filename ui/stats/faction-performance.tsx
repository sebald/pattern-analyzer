'use client';

import { ResponsiveBar } from '@nivo/bar';

import { Card } from '@/ui';
import type { XWSFaction } from '@/lib/types';
import { getFactionName } from '@/lib/get-value';
import { FACTION_ABBR, FACTION_COLORS, toPercentage } from '@/lib/utils';

import { theme } from './theme';

// Props
// ---------------
export interface FactionPerformanceProps {
  value: {
    [Faction in XWSFaction | 'unknown']: {
      percentile: number;
      deviation: number;
    };
  };
  ignoreUnknown?: boolean;
}

// Component
// ---------------
export const FactionPerformance = ({
  value,
  ignoreUnknown,
}: FactionPerformanceProps) => {
  const data = Object.entries(value)
    .map(([key, { percentile, deviation }]) => {
      const faction = key as XWSFaction | 'unknown';
      return {
        faction,
        percentile,
        deviation,
      };
    })
    // Remove "unknown" if everything was parsed!
    .filter(({ faction, percentile }) =>
      faction !== 'unknown' ? true : ignoreUnknown ? false : percentile > 0
    );

  return (
    <Card>
      <Card.Title>Faction Performance</Card.Title>
      <div className="h-72">
        <ResponsiveBar
          data={[...data].sort((a, b) => a.percentile - b.percentile)}
          indexBy="faction"
          keys={['percentile']}
          minValue={0}
          maxValue={1}
          valueFormat={toPercentage}
          axisLeft={{
            format: toPercentage,
          }}
          axisBottom={{
            format: (faction: XWSFaction | 'unknown') => FACTION_ABBR[faction],
          }}
          theme={theme}
          barComponent={({
            bar: {
              x,
              y,
              width,
              height,
              data: { data },
            },
          }) => {
            const deviationWidth = 2;
            // "Magic height" = height of the parent element - top/bottom margin
            const deviationHeight = 258 * data.deviation * 2;
            const color = FACTION_COLORS[data.faction];

            return (
              <>
                <rect
                  x={x + width / deviationWidth - 1}
                  y={y - deviationHeight / 2}
                  height={deviationHeight}
                  width={deviationWidth}
                  fill={color}
                  fillOpacity={0.5}
                />
                <circle
                  cx={x + width / 2}
                  cy={y}
                  r={Math.min(width, height) / 8}
                  fill={color}
                />
              </>
            );
          }}
          padding={0.3}
          margin={{ top: 10, right: 10, bottom: 20, left: 45 }}
          animate={false}
        />
      </div>
      <Card.Footer>
        <div className="grid grid-cols-2 gap-2 px-1 pt-2 lg:grid-cols-3">
          {data.map(({ faction, percentile }) => (
            <div
              key={faction}
              className="flex items-center gap-1 text-xs text-secondary-900"
            >
              <div
                className="h-2 w-2"
                style={{ background: FACTION_COLORS[faction] }}
              />
              <div className="font-medium">
                {faction === 'unknown' ? 'Unknown' : getFactionName(faction)}:
              </div>
              {toPercentage(percentile)}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

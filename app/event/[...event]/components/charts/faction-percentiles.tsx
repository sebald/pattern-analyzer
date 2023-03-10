import { ResponsiveBar } from '@nivo/bar';

import { XWSFaction } from 'lib/types';
import { Card } from 'components';
import {
  FACTION_COLORS_DARK,
  FACTION_COLORS_LIGHT,
  toPercentage,
} from './shared';

// Props
// ---------------
export interface FactionPercentilesProps {
  value: {
    [Faction in XWSFaction | 'unknown']: {
      percentile: number;
      deviation: number;
    };
  };
}

// Component
// ---------------
export const FactionPercentiles = ({ value }: FactionPercentilesProps) => {
  const data = Object.entries(value).map(([key, { percentile, deviation }]) => {
    const faction = key as XWSFaction | 'unknown';
    return {
      faction,
      percentile,
      deviation,
    };
  });
  data.sort((a, b) => a.percentile - b.percentile);

  return (
    <Card>
      <Card.Title>Faction Performance</Card.Title>
      <div className="h-72">
        <ResponsiveBar
          data={data}
          indexBy="faction"
          keys={['percentile']}
          minValue={0}
          maxValue={1}
          valueFormat={value => toPercentage(value)}
          axisLeft={{ format: value => toPercentage(value) }}
          axisBottom={{ format: v => `???` }}
          barComponent={props => {
            console.log(props);
            const {
              bar: {
                x,
                y,
                absY,
                width,
                height,
                data: { data },
              },
            } = props;
            const deviationWidth = 2;
            const deviationHeight = absY * data.deviation * 2;

            return (
              <>
                <rect
                  x={x + width / deviationWidth - 1}
                  y={y - deviationHeight / 2}
                  height={deviationHeight}
                  width={deviationWidth}
                  fill={FACTION_COLORS_LIGHT[data.faction]}
                />
                <circle
                  cx={x + width / 2}
                  cy={y}
                  r={Math.min(width, height) / 6}
                  fill={FACTION_COLORS_DARK[data.faction]}
                />
                {/* <circle
                  cx={x + width / 2}
                  cy={y + height / 2}
                  r={Math.min(width, height) * data.data.deviation * 2}
                  fill="#000"
                /> */}
              </>
            );
          }}
          padding={0.3}
          margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
          animate
        />
      </div>
      {data.map(({ faction, percentile, deviation }) => (
        <div key={faction}>
          {faction}: {percentile} ({deviation})
        </div>
      ))}
    </Card>
  );
};

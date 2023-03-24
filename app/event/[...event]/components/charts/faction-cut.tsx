import { ResponsiveBar } from '@nivo/bar';

import { Card } from '@/components';
import { getFactionName } from '@/lib/get-value';
import type { XWSFaction } from '@/lib/types';
import { FACTION_ABBR, FACTION_COLORS, toPercentage } from './shared';
import { round } from '@/lib/utils';

// Props
// ---------------
export interface FactionCutProps {
  cut: number;
  value: {
    [Faction in XWSFaction | 'unknown']: {
      ranks: number[];
      count: number;
    };
  };
}

// Component
// ---------------
export const FactionCut = ({ cut, value }: FactionCutProps) => {
  const data = Object.entries(value).map(([key, { count, ranks }]) => {
    const faction = key as XWSFaction | 'unknown';
    const cutsize = ranks.filter(rank => rank <= cut).length;
    const cutrate = round(cutsize / count, 4);

    return {
      faction,
      cutsize,
      cutrate,
    };
  });

  return (
    <Card>
      <Card.Title>Faction Cut Rate</Card.Title>
      <div className="h-72">
        <ResponsiveBar
          data={[...data].sort((a, b) => a.cutrate - b.cutrate)}
          indexBy="faction"
          keys={['cutrate']}
          minValue={0}
          valueFormat={value => (value > 0 ? toPercentage(value) : '')}
          axisLeft={{
            format: toPercentage,
          }}
          axisBottom={{
            format: (faction: XWSFaction | 'unknown') => FACTION_ABBR[faction],
          }}
          colors={({ data }) => FACTION_COLORS[data.faction]}
          padding={0.3}
          margin={{ top: 10, right: 20, bottom: 20, left: 50 }}
          isInteractive={false}
          animate
        />
      </div>
      <Card.Footer>
        <div className="grid grid-cols-2 gap-2 px-1 pt-2 lg:grid-cols-3">
          {data.map(({ faction, cutsize }) => (
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
              {cutsize}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

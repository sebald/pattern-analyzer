'use client';

import { ResponsivePie } from '@nivo/pie';

import { Card } from '@/ui';
import { getFactionName } from '@/lib/get-value';
import type { XWSFaction } from '@/lib/types';
import { FACTION_ABBR, FACTION_COLORS, toPercentage } from '@/lib/utils';

// Props
// ---------------
export interface FactionDistributionProps {
  value: { [key in XWSFaction | 'unknown']: { count: number } };
  total: number;
  ignoreUnknown?: boolean;
}

// Component
// ---------------
export const FactionDistribution = ({
  value,
  total,
  ignoreUnknown,
}: FactionDistributionProps) => {
  let t = total;
  let data = (
    Object.entries(value) as [XWSFaction | 'unknown', { count: number }][]
  )
    .map(([faction, { count }]) => ({
      id: faction,
      value: count,
      color: FACTION_COLORS[faction],
    }))
    // Remove "uknown" if everything was parsed!
    .filter(({ id, value }) => (id !== 'unknown' ? true : value > 0)) as {
    id: XWSFaction | 'unknown';
    value: number;
    color: string;
  }[];

  if (ignoreUnknown) {
    const unknown = data.find(({ id }) => id === 'unknown');
    t = total - ((unknown && unknown.value) || 0);
    data = data.filter(({ id }) => id !== 'unknown');
  }

  return (
    <Card>
      <Card.Title>Faction Distribution</Card.Title>
      <div className="h-60 md:h-72">
        <ResponsivePie
          data={data.filter(({ value }) => value > 0) as any}
          valueFormat={value => toPercentage(value / t)}
          arcLinkLabel={({ data }) =>
            FACTION_ABBR[(data as any).id as XWSFaction | 'unknown']
          }
          colors={{ datum: 'data.color' }}
          sortByValue
          innerRadius={0.5}
          padAngle={0.5}
          cornerRadius={3}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          isInteractive={false}
          animate={false}
        />
      </div>
      <Card.Footer>
        <div className="grid grid-cols-2 gap-2 px-1 pt-2 lg:grid-cols-3">
          {data.map(({ id, value, color }) => (
            <div
              key={id}
              className="flex items-center gap-1 text-xs text-secondary-900"
            >
              <div className="h-2 w-2" style={{ background: color }} />
              <div className="font-medium">
                {id === 'unknown' ? 'Unknown' : getFactionName(id)}:
              </div>
              {value}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

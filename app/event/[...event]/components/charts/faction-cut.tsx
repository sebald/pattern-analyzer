'use client';

import { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { Card } from '@/components';
import { getFactionName } from '@/lib/get-value';
import { round } from '@/lib/utils';
import type { XWSFaction } from '@/lib/types';

import { FACTION_ABBR, FACTION_COLORS, toPercentage } from './shared';

// Helpers
// ---------------

/**
 * Based on FFGs tournament regulations. This is just to have
 * some sensible defaults.
 */
const getCutBySize = (size: number) => {
  if (size < 9) {
    return 2;
  }

  if (size >= 9 && size <= 12) {
    return 4;
  }

  if (size >= 13 && size <= 76) {
    return 8;
  }

  if (size >= 77 && size <= 148) {
    return 16;
  }

  return 32;
};

// Props
// ---------------
export interface FactionCutProps {
  tournament: {
    count: number;
    cut: number;
  };
  value: {
    [Faction in XWSFaction | 'unknown']: {
      ranks: number[];
      count: number;
    };
  };
}

// Component
// ---------------
export const FactionCut = ({ tournament, value }: FactionCutProps) => {
  const [cut, setCut] = useState(
    tournament.cut > 0 ? tournament.cut : getCutBySize(tournament.count)
  );

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
      <Card.Title>
        {tournament.cut ? 'Faction Cut Rate' : `Faction TOP${cut} Rate`}
      </Card.Title>
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

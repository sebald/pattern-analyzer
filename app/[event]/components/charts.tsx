'use client';

import { getFactionName } from 'lib/get-value';
import { XWSFaction } from 'lib/types';
import { Card } from 'components';
import { ResponsivePie } from '@nivo/pie';

// Helpers
// ---------------
const FACTION_COLORS: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: '#d7d7d7',
  galacticempire: '#2f4e9f',
  scumandvillainy: '#ca8a04',
  resistance: '#f59e0b',
  firstorder: '#872424',
  galacticrepublic: '#7f1d1d',
  separatistalliance: '#3730a3',
  unknown: '#cbd5e1',
};

// Props
// ---------------
export interface FactionDoughnutProps {
  // value: { [key in XWSFaction | 'unknown']: number };
}

// Component
// ---------------
export const FactionDoughnut = () => {
  // const data = Object.entries(value).reduce(
  //   (o, [faction, count]) => {
  //     o.labels!.push(
  //       faction === 'unknown' ? 'Unknown' : getFactionName(faction as any)
  //     );
  //     o.datasets[0].data.push(count);

  //     // @ts-expect-error
  //     o.datasets[0].backgroundColor.push(FACTION_COLORS[faction as any]);

  //     return o;
  //   },
  //   {
  //     labels: [],
  //     datasets: [{ data: [], backgroundColor: [] }],
  //   } as any
  // );
  // const total = Object.values(value).reduce((t, val) => t + val, 0);
  // console.log(value);
  return (
    <Card>
      <Card.Title>Faction Distribution</Card.Title>
      <div className="h-60">
        <ResponsivePie
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          data={[
            {
              id: 'stylus',
              label: 'stylus',
              value: 422,
              color: 'hsl(152, 70%, 50%)',
            },
            {
              id: 'erlang',
              label: 'erlang',
              value: 405,
              color: 'hsl(345, 70%, 50%)',
            },
            {
              id: 'java',
              label: 'java',
              value: 216,
              color: 'hsl(106, 70%, 50%)',
            },
            {
              id: 'php',
              label: 'php',
              value: 165,
              color: 'hsl(236, 70%, 50%)',
            },
            {
              id: 'c',
              label: 'c',
              value: 236,
              color: 'hsl(135, 70%, 50%)',
            },
          ]}
          animate
          activeOuterRadiusOffset={8}
          innerRadius={0.6}
        />
      </div>
    </Card>
  );
};

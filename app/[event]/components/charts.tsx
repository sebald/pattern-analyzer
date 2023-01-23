'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { getFactionName } from 'lib/get-value';
import { XWSFaction } from 'lib/types';
import { Card } from 'components';

// Registration
// ---------------
ChartJS.register(ArcElement, Tooltip, Legend);

// Helpers
// ---------------
const FACTION_COLORS: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: '#d73737',
  galacticempire: '#2f4e9f',
  scumandvillainy: '#b79e33',
  resistance: '#ffa500',
  firstorder: '#872424',
  galacticrepublic: '#a17747',
  separatistalliance: '#363ca3',
  unknown: '#e5e7eb',
};

// Props
// ---------------
export interface FactionDoughnutProps {
  value: { [key in XWSFaction | 'unknown']: number };
}

// Component
// ---------------
export const FactionDoughnut = ({ value }: FactionDoughnutProps) => {
  const data = Object.entries(value).reduce(
    (o, [faction, count]) => {
      o.labels!.push(
        faction === 'unknown' ? 'Unknown' : getFactionName(faction as any)
      );
      o.datasets[0].data.push(count);

      // @ts-expect-error
      o.datasets[0].backgroundColor.push(FACTION_COLORS[faction as any]);

      return o;
    },
    {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    } as ChartData<'doughnut', number[], string>
  );
  const total = Object.values(value).reduce((t, val) => t + val, 0);
  console.log(value);
  return (
    <Card>
      <Card.Title>Factions</Card.Title>
      <div className="h-60">
        <Doughnut
          options={{
            plugins: {
              legend: {
                position: 'right',
                onClick: e => e.native?.stopPropagation(),
              },
              tooltip: {
                backgroundColor: '#0f172a',
                displayColors: false,
                callbacks: {
                  label(ctx) {
                    const percentage = new Intl.NumberFormat('default', {
                      style: 'percent',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(ctx.parsed / total);

                    return `${ctx.formattedValue} (${percentage})`;
                  },
                },
              },
            },
            maintainAspectRatio: false,
          }}
          data={data}
        />
      </div>
    </Card>
  );
};

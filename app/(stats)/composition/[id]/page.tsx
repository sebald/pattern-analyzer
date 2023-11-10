import { notFound } from 'next/navigation';

import {
  SquadCompositionStats,
  compositionDetails,
} from '@/lib/stats/details/composition';
import { createMetadata } from '@/lib/metadata';
import { fromDate } from '@/lib/utils/date.utils';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getShipName } from '@/lib/get-value';
import { pointsUpdateDate } from '@/lib/config';
import { toPercentage } from '@/lib/utils';

import { Card, Detail, Headline, ShipIcon } from '@/ui';

import { PilotDetails } from './_component/pilot-details';
import { SquadGroups } from './_component/squad-groups';
import { TrendCurve } from './_component/trend-curve';

// Config
// ---------------
export const revalidate = 21600; // 6 hours

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = async () => {
  const squads = await getSquads({ from: fromDate(pointsUpdateDate) });
  const compositions = new Set<string>();

  squads.forEach(({ composition }) => {
    if (composition) {
      compositions.add(composition);
    }
  });

  return [...compositions].map(id => ({
    id,
  }));
};

// Props
// ---------------
interface PageParams {
  params: {
    id: string;
  };
}

// Metadata
// ---------------
export const generateMetadata = ({ params }: PageParams) => {
  const ships = params.id.split('.').map(ship => getShipName(ship));
  return createMetadata({
    title: `Squad Composition: ${ships.join(', ')}`,
    description: 'Take a look at what is currently flown in X-Wing!',
    ogShips: params.id,
  });
};

// Data
// ---------------
const getCompositionStats = async (composition: string, from: Date) => {
  const [squads, count] = await Promise.all([
    getSquads({ from, composition }),
    getFactionCount({ from }),
  ]);
  return compositionDetails({ composition, squads, count });
};

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  let stats: SquadCompositionStats;
  try {
    stats = await getCompositionStats(params.id, fromDate(pointsUpdateDate));
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-4 pt-3 md:grid-cols-12">
        <Card className="col-span-full md:col-span-6">
          <Card.Header>
            <Card.Title>Overview</Card.Title>
          </Card.Header>
          <Card.Body className="flex flex-col gap-8 px-2 lg:px-4">
            <Detail
              label="Chassis"
              size="large"
              value={
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                  {stats.ships.map((ship, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <ShipIcon ship={ship} className="text-3xl" />
                      <span className="whitespace-nowrap text-lg">
                        {getShipName(ship)}
                      </span>
                    </div>
                  ))}
                </div>
              }
            />
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(155px,100%),1fr))] gap-2 pb-2">
              <Detail
                label="Percentile"
                size="large"
                value={toPercentage(stats.percentile)}
              />
              <Detail
                label="Deviation"
                size="large"
                value={toPercentage(stats.deviation)}
              />
              <Detail
                label="Winrate"
                size="large"
                value={
                  stats.winrate !== null ? toPercentage(stats.winrate) : '-'
                }
              />
              <Detail
                label="Frequency (in Faction)"
                size="large"
                value={toPercentage(stats.frequency)}
              />
              <Detail label="Count" size="large" value={stats.count} />
            </div>
          </Card.Body>
        </Card>
        <Card className="col-span-full md:col-span-6">
          <Card.Header>
            <Card.Title>Trend</Card.Title>
          </Card.Header>
          <Card.Body>
            <TrendCurve from={pointsUpdateDate} value={stats.trend} />
          </Card.Body>
        </Card>
      </div>
      <div>
        <Headline level="2" variant="section">
          Squads
        </Headline>
        <Card size="fit" inset="list">
          <Card.Body>
            <SquadGroups value={stats.squads} />
          </Card.Body>
        </Card>
      </div>
      <PilotDetails ships={stats.ships} value={stats.pilot} />
    </div>
  );
};

export default Page;

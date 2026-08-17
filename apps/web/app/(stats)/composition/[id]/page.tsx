import { notFound } from 'next/navigation';

import { compositionDetails } from '@/lib/stats/details/composition';
import { createMetadata } from '@/lib/metadata';
import { toDate } from '@/lib/utils/date.utils';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getShipName } from '@pattern-analyzer/xws/get-value';
import { defaultStatsRange } from '@/lib/stats/range';
import { toPercentage } from '@/lib/utils/math.utils';

import { Card } from '@/ui/card';
import { Detail } from '@/ui/detail';
import { Headline } from '@/ui/headline';
import { ShipIcon } from '@/ui/ship-icon';
import { EmptyRange } from '@/ui/stats/empty-range';
import { HistoryCurve } from '@/ui/stats/history-curve';
import { SquadGroups } from '@/ui/stats/squad-groups';

import { PilotDetails } from './_component/pilot-details';

// Config
// ---------------
export const revalidate = 21600; // 6 hours

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = async () => {
  const { from, to } = await defaultStatsRange();
  const squads = await getSquads({ from, to });
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
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Metadata
// ---------------
export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params;
  const ships = id.split('.').map(ship => getShipName(ship));
  return createMetadata({
    title: `Squad Composition: ${ships.join(', ')}`,
    description: 'Take a look at what is currently flown in X-Wing!',
    ogShips: id,
  });
};

// Data
// ---------------
const getCompositionStats = async (
  composition: string,
  { from, to }: { from: Date; to?: Date }
) => {
  const [squads, count] = await Promise.all([
    getSquads({ from, to, composition }),
    getFactionCount({ from, to }),
  ]);
  return compositionDetails({ composition, squads, count });
};

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  // Only a list of ships can ever be a composition.
  if (id.split('.').some(ship => !getShipName(ship))) {
    notFound();
  }

  const range = await defaultStatsRange();
  const stats = await getCompositionStats(id, range);

  // The composition exists, it was just not flown in the current window.
  if (!stats) {
    return <EmptyRange subject="composition" range={range} />;
  }

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-4 pt-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex flex-col gap-4">
            <Card inset="headless">
              <Detail
                label="Chassis"
                size="xlarge"
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
            </Card>
            <Card
              inset="headless"
              size="fit"
              className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3"
            >
              <Detail
                label="Percentile"
                size="xlarge"
                value={toPercentage(stats.percentile)}
              />
              <Detail
                label="Std. Deviation"
                size="xlarge"
                value={toPercentage(stats.deviation)}
              />
              <Detail
                label="Winrate"
                size="xlarge"
                value={
                  stats.winrate !== null ? toPercentage(stats.winrate) : '-'
                }
              />
              <Detail
                label="Frequency (in Faction)"
                size="xlarge"
                className={{ container: 'lg:col-span-2' }}
                value={toPercentage(stats.frequency)}
              />

              <Detail label="Count" size="xlarge" value={stats.count} />
            </Card>
          </div>
        </div>
        <Card className="col-span-full md:col-span-7">
          <Card.Header>
            <Card.Title>History</Card.Title>
          </Card.Header>
          <Card.Body>
            <HistoryCurve
              from={toDate(range.from)}
              to={range.to ? toDate(range.to) : undefined}
              value={stats.history}
            />
          </Card.Body>
        </Card>
      </div>
      <div>
        <Headline level="2" variant="section">
          Squads
        </Headline>
        <Card size="fit" inset="none">
          <Card.Body>
            <SquadGroups value={stats.squads} />
          </Card.Body>
        </Card>
      </div>
      <PilotDetails
        value={stats.pilot}
        baseline={{
          ships: stats.ships,
          percentile: stats.percentile,
        }}
      />
    </div>
  );
};

export default Page;

import { baseUrl, pointsUpdateDate } from '@/lib/config';
import { getShipName } from '@/lib/get-value';
import { compositionDetails } from '@/lib/stats/details/composition';
import { toPercentage } from '@/lib/utils';
import { fromDate } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';

import { Card, Detail, ShipIcon } from '@/ui';

import { PilotDetails } from './_component/pilot-details';
import { SquadGroups } from './_component/squad-groups';
import { TrendCurve } from './_component/trend-curve';
import { createMetadata } from '@/lib/metadata';

// Config
// ---------------
export const revalidate = 21600; // 6 hours

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = async () => {
  const tournaments = await getAllTournaments({
    from: fromDate(pointsUpdateDate),
    format: 'standard',
  });

  const squads = await Promise.all(
    tournaments.map(({ id }) => getSquads({ id: `${id}` }))
  );

  const compositions = new Set<string>();
  squads.flat().forEach(({ xws }) => {
    if (!xws) return;

    const id = xws.pilots.map(({ ship }) => ship).join('.');
    compositions.add(id);
  });

  return [...compositions.values()].map(id => ({
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
    title: `Composition: ${ships.join(', ')}`,
    description: 'Take a look at what is currently flown in X-Wing!',
    ogShips: params.id,
  });
};

// Data
// ---------------
const getCompositionStats = async (id: string, from: Date) => {
  const tournaments = await getAllTournaments({
    from,
    format: 'standard',
  });

  const data = await Promise.all(
    tournaments.map(({ id, date }) =>
      getSquads({ id: `${id}` }).then(squads => ({ date, squads }))
    )
  );

  return compositionDetails(id, data);
};

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  const stats = await getCompositionStats(
    params.id,
    fromDate(pointsUpdateDate)
  );

  return (
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
                    <ShipIcon key={idx} ship={ship} className="text-3xl" />
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
              value={stats.winrate !== null ? toPercentage(stats.winrate) : '-'}
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
          <Card.Body>
            <TrendCurve value={stats.trend} />
          </Card.Body>
        </Card.Header>
      </Card>
      <PilotDetails
        className="col-span-full"
        ships={stats.ships}
        value={stats.pilot}
      />
      <Card size="fit" inset="list" className="col-span-full">
        <Card.Header>
          <Card.Title>Squads</Card.Title>
          <Card.Body>
            <SquadGroups value={stats.squads} />
          </Card.Body>
        </Card.Header>
      </Card>
    </div>
  );
};

export default Page;

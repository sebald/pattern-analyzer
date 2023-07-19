import { pointsUpdateDate } from '@/lib/config';
import { getShipName } from '@/lib/get-value';
import { compositionDetails } from '@/lib/stats/details/composition';
import { toPercentage } from '@/lib/utils';
import { fromDate } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';

import { Card, Detail, ShipIcon, Squad } from '@/ui';

import { TrendCurve } from './_component/trend-curve';

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

// Props
// ---------------
interface PageParams {
  params: {
    id: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  const stats = await getCompositionStats(
    params.id,
    fromDate(pointsUpdateDate)
  );

  return (
    <div className="grid gap-4 pt-3 md:grid-cols-12">
      <Card className="col-span-full md:col-span-6 lg:col-span-3">
        <Card.Header>
          <Card.Title>Chassis</Card.Title>
        </Card.Header>
        <Card.Body className="flex flex-col gap-2 px-3">
          {stats.ships.map((ship, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <ShipIcon key={idx} ship={ship} className="text-3xl" />
              <span className="text-sm font-medium">{getShipName(ship)}</span>
            </div>
          ))}
        </Card.Body>
      </Card>
      <Card className="col-span-full md:col-span-6 lg:col-span-4">
        <Card.Header>
          <Card.Title>Stats</Card.Title>
        </Card.Header>
        <Card.Body className="grid grid-flow-row grid-cols-2 gap-y-4 px-3">
          <Detail label="Percentile" value={toPercentage(stats.percentile)} />
          <Detail label="Deviation" value={toPercentage(stats.deviation)} />
          <Detail
            label="Winrate"
            value={stats.winrate !== null ? toPercentage(stats.winrate) : '-'}
          />
          <Detail
            label="Frequency (Overall)"
            value={toPercentage(stats.frequency)}
          />
          <Detail label="Count" value={stats.count} />
        </Card.Body>
      </Card>
      <Card className="col-span-full md:col-span-12 lg:col-span-5">
        <Card.Header>
          <Card.Title>Trend</Card.Title>
          <Card.Body>
            <TrendCurve value={stats.trend} />
          </Card.Body>
        </Card.Header>
      </Card>
      <Card className="col-span-full px-0">
        <Card.Header>
          <Card.Title>Squads</Card.Title>
          <Card.Body className="grid divide-y">
            {/* {stats.squads.map(({ player, event, xws }) => (
              <div
                key={player + event.date + event.rank.swiss}
                className="px-8 py-6"
              >
                <Squad variant="narrow" size="small" xws={xws} />
              </div>
            ))} */}
          </Card.Body>
        </Card.Header>
      </Card>
    </div>
  );
};

export default Page;

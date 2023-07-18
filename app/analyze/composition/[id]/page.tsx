import { pointsUpdateDate } from '@/lib/config';
import { getShipName } from '@/lib/get-value';
import { compositionDetails } from '@/lib/stats/details/composition';
import { toPercentage } from '@/lib/utils';
import { fromDate } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { Card, Detail, Headline, ShipIcon } from '@/ui';

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
  console.log(stats.ships);
  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>Overview</Card.Title>
        </Card.Header>
        <Card.Body className="px-3">
          <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="flex flex-col pb-5 md:row-span-3 md:pb-0 md:pt-2">
              <Detail
                label="Ships"
                value={stats.ships.map((ship, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-secondary-700"
                  >
                    <ShipIcon key={idx} ship={ship} className="text-3xl" />
                    <span className="text-sm font-medium">
                      {getShipName(ship)}
                    </span>
                  </div>
                ))}
              />
            </div>
            <div className="py-5 md:col-start-2 md:pb-3 md:pl-8 md:pt-2">
              <Detail
                label="Percentile"
                value={`${toPercentage(stats.percentile)} (${toPercentage(
                  stats.deviation
                )})`}
              />
            </div>
            <div className="py-5 md:col-start-2 md:py-3 md:pl-8">
              <Detail
                label="Winrate"
                value={
                  stats.winrate !== null ? toPercentage(stats.winrate) : '-'
                }
              />
            </div>
            <div className="py-5 md:col-start-2 md:pl-8 md:pt-3">
              <Detail
                label="Frequency (Overall)"
                value={`${toPercentage(stats.frequency)} (${stats.count})`}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Page;

import { baseUrl, pointsUpdateDate } from '@/lib/config';
import { getPilotName, getShipName } from '@/lib/get-value';
import { compositionDetails } from '@/lib/stats/details/composition';
import { toPercentage } from '@/lib/utils';
import { fromDate } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { isStandardized, upgradesToList } from '@/lib/xws';

import { Badge, Card, Detail, PilotImage, ShipIcon } from '@/ui';

import { SquadGroups } from './_component/squad-groups';
import { TrendCurve } from './_component/trend-curve';
import { Fragment } from 'react';
import { Info } from '@/ui/icons';

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

// Metadata
// ---------------
export const metadata = {
  title: 'Pattern Analyzer | Composition Details',
  description: 'Take a loot at what is currently flown in X-Wing!',
  openGraph: {
    siteName: 'Pattern Analyzer',
    title: 'Composition Details',
    description: 'Take a loot at what is currently flown in X-Wing!',
    images: `${baseUrl}/api/og.png`,
    locale: 'en-US',
    type: 'website',
  },
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
      <Card className="col-span-full">
        <Card.Header>
          <Card.Title>Chassis</Card.Title>
        </Card.Header>
        <Card.Body className="flex flex-wrap gap-x-4 gap-y-1 px-3 md:justify-center lg:gap-x-8">
          {stats.ships.map((ship, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <ShipIcon key={idx} ship={ship} className="text-3xl" />
              <span className="whitespace-nowrap text-sm font-medium">
                {getShipName(ship)}
              </span>
            </div>
          ))}
        </Card.Body>
      </Card>
      <div className="col-span-full flex flex-col gap-4 md:col-span-6 lg:col-span-5 lg:col-start-8">
        <Card size="fit">
          <Card.Header>
            <Card.Title>Stats</Card.Title>
          </Card.Header>
          <Card.Body className="grid grid-cols-[repeat(auto-fit,_minmax(min(155px,100%),1fr))] gap-2 px-2 pb-2 lg:px-4">
            <Detail label="Percentile" value={toPercentage(stats.percentile)} />
            <Detail label="Deviation" value={toPercentage(stats.deviation)} />
            <Detail
              label="Winrate"
              value={stats.winrate !== null ? toPercentage(stats.winrate) : '-'}
            />
            <Detail
              label="Frequency (in Faction)"
              value={toPercentage(stats.frequency)}
            />
            <Detail label="Count" value={stats.count} />
          </Card.Body>
        </Card>
        <Card size="fit">
          <Card.Header>
            <Card.Title>Trend</Card.Title>
            <Card.Body>
              <TrendCurve value={stats.trend} />
            </Card.Body>
          </Card.Header>
        </Card>
      </div>
      <div className="col-span-full px-0 pb-0 lg:col-span-7 lg:row-start-2">
        <Card size="fit" inset="list">
          <Card.Header>
            <Card.Title>Squads</Card.Title>
            <Card.Body>
              <SquadGroups value={stats.squads} />
            </Card.Body>
          </Card.Header>
        </Card>
      </div>
      <Card className="col-span-full" inset="list">
        <Card.Header>
          <Card.Title>Pilots</Card.Title>
          <Card.Body variant="enumeration">
            {Object.entries(stats.pilot).map(([pid, current]) => (
              <div
                key={pid}
                className="grid gap-x-4 gap-y-5 px-4 py-5 md:grid-cols-[150px,auto] md:grid-rows-[auto,auto,auto] lg:grid-cols-[200px,auto] lg:gap-y-3"
              >
                <PilotImage
                  className="row-span-full hidden rounded-md md:block"
                  pilot={pid}
                  type="art"
                  width={250}
                  height={250}
                />
                <div className="text-xl font-semibold leading-none lg:text-2xl lg:font-bold">
                  {getPilotName(pid)}
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-0.5">
                  <Detail
                    variant="secondary"
                    size="small"
                    align="left"
                    className="max-w-[150px]"
                    label="Percentile:"
                    value={toPercentage(current.percentile)}
                  />
                  <Detail
                    variant="secondary"
                    size="small"
                    align="left"
                    className="max-w-[150px]"
                    label="Deviation:"
                    value={toPercentage(current.deviation)}
                  />
                  <Detail
                    variant="secondary"
                    size="small"
                    align="left"
                    className="max-w-[150px]"
                    label="Winrate:"
                    value={
                      current.winrate ? toPercentage(current.winrate) : '-'
                    }
                  />
                  <Detail
                    variant="secondary"
                    size="small"
                    align="left"
                    className="max-w-[150px]"
                    label="Frequency:"
                    value={toPercentage(current.frequency)}
                  />
                </div>
                <div className="pt-4">
                  <div className="text-sm font-medium uppercase text-secondary-500">
                    Performance with Loadout
                  </div>
                  {isStandardized(pid) ? (
                    <div className="text-secondary-950 flex items-center gap-1 pt-2 text-sm italic">
                      <Info className="h-4 w-4" /> Standarized Pilot. No
                      variations in loadout possible.
                    </div>
                  ) : (
                    <div className="grid max-w-3xl grid-cols-[max-content,auto,max-content] gap-4 pt-4 lg:pt-2">
                      {current.upgrades.map(
                        ({ id, list, count, percentile }) => (
                          <Fragment key={id}>
                            <div className="leading-6">
                              <Badge
                                className="tabular-nums"
                                variant="neutral"
                                size="small"
                              >
                                {count}
                              </Badge>
                            </div>
                            <div className="font-medium">
                              {upgradesToList(list)}
                            </div>
                            <div className="text-sm leading-6">
                              {toPercentage(percentile)}
                            </div>
                          </Fragment>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* <PilotTable value={stats.pilot} /> */}
          </Card.Body>
        </Card.Header>
      </Card>
    </div>
  );
};

export default Page;

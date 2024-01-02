import { notFound } from 'next/navigation';

import { pointsUpdateDate } from '@/lib/config';
import data from '@/lib/data/display-values.json';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getPilotName } from '@/lib/get-value';
import { createMetadata } from '@/lib/metadata';
import { pilotDetails } from '@/lib/stats/details/pilot';
import { fromDate } from '@/lib/utils/date.utils';
import { Card, Detail, Headline } from '@/ui';
import { toPercentage } from '@/lib/utils';
import { HistoryCurve } from '@/ui/stats/history-curve';
import { SmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { Filter } from '@/ui/params/filter';

import { FilteredSquadGroups } from './_components/filtered-squad-groups';
import { PilotLoadouts } from './_components/pilot-loadouts';
import { isStandardized } from '@/lib/xws';
import { Info } from '@/ui/icons';

// Config
// ---------------
export const revalidate = 21600; // 6 hours

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = async () =>
  Object.keys(data.pilot).map(id => ({ id }));

// Props
// ---------------
interface PageProps {
  params: {
    id: string;
  };
}

// Metadata
// ---------------
export const generateMetadata = ({ params }: PageProps) => {
  const pilot = getPilotName(params.id) || params.id;
  return createMetadata({
    title: pilot,
    description: `Statistics and other data for ${pilot}`,
    ogTitle: pilot,
  });
};

// Data
// ---------------
const getPilotStats = async (pilot: string, from: Date) => {
  const [squads, count] = await Promise.all([
    getSquads({ from, pilot }),
    getFactionCount({ from }),
  ]);
  return pilotDetails({ pilot, squads, count });
};

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  if (!getPilotName(params.id)) {
    notFound();
  }

  const stats = await getPilotStats(params.id, fromDate(pointsUpdateDate));

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-4 pt-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <Card inset="headless">
              <Detail
                label="Percentile"
                size="xlarge"
                value={toPercentage(stats.percentile)}
              />
            </Card>
            <Card inset="headless">
              <Detail
                label="Std. Deviation"
                size="xlarge"
                value={toPercentage(stats.deviation)}
              />
            </Card>
            <Card inset="headless">
              <Detail
                label="Winrate"
                size="xlarge"
                value={
                  stats.winrate !== null ? toPercentage(stats.winrate) : '-'
                }
              />
            </Card>
            <Card inset="headless" className="lg:col-span-2">
              <Detail
                label="Frequency (in Faction)"
                size="xlarge"
                value={toPercentage(stats.frequency)}
              />
            </Card>
            <Card inset="headless">
              <Detail label="Count" size="xlarge" value={stats.count} />
            </Card>
          </div>
        </div>
        <Card className="col-span-full md:col-span-7">
          <Card.Header>
            <Card.Title>History</Card.Title>
          </Card.Header>
          <Card.Body>
            <HistoryCurve from={pointsUpdateDate} value={stats.history} />
          </Card.Body>
        </Card>
      </div>
      <div>
        <div className="flex items-end justify-between">
          <Headline level="2" variant="section">
            Squads
          </Headline>
          <Filter>
            <SmallSamplesFilter />
          </Filter>
        </div>
        <Card size="fit" inset="list">
          <Card.Body>
            <FilteredSquadGroups value={stats.squads} />
          </Card.Body>
        </Card>
      </div>
      <div>
        <div className="flex items-end justify-between">
          <Headline level="2" variant="section">
            Loadouts
          </Headline>
          <Filter>
            <SmallSamplesFilter />
          </Filter>
        </div>
        {isStandardized(params.id) ? (
          <Card
            inset="headless"
            className="flex flex-row items-center gap-1 text-lg italic"
          >
            <Info className="h-6 w-6" /> Standarized Pilot. No loadout
            variations.
          </Card>
        ) : (
          <Card size="fit" inset="list">
            <Card.Body variant="enumeration">
              <PilotLoadouts
                value={stats.upgrades}
                baseline={{ percentile: stats.percentile }}
              />
            </Card.Body>
          </Card>
        )}
      </div>
      <div>
        <div className="flex items-end justify-between">
          <Headline level="2" variant="section">
            Squadmates
          </Headline>
          <Filter>
            <SmallSamplesFilter />
          </Filter>
        </div>
        <Card size="fit" inset="list">
          <Card.Body>
            <pre>
              <code>{JSON.stringify(stats.squadmates, null, 2)}</code>
            </pre>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Page;

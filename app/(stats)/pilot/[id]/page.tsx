import { notFound } from 'next/navigation';

import { pointsUpdateDate } from '@/lib/config';
import data from '@/lib/data/display-values.json';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getPilotName } from '@/lib/get-value';
import { createMetadata } from '@/lib/metadata';
import { PilotStats, pilotDetails } from '@/lib/stats/details/pilot';
import { fromDate } from '@/lib/utils/date.utils';
import { Card, Detail } from '@/ui';
import { toPercentage } from '@/lib/utils';
import { HistoryCurve } from '@/ui/stats/history-curve';

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
  let stats: PilotStats;
  try {
    stats = await getPilotStats(params.id, fromDate(pointsUpdateDate));
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-4 pt-3 md:grid-cols-12">
        <Card className="col-span-full md:col-span-5">
          <Card.Header>
            <Card.Title>Overview</Card.Title>
          </Card.Header>
          <Card.Body className="grid grid-cols-[repeat(auto-fit,_minmax(min(155px,100%),1fr))] gap-2 pb-2">
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
          </Card.Body>
        </Card>
        <Card className="col-span-full md:col-span-7">
          <Card.Header>
            <Card.Title>History</Card.Title>
          </Card.Header>
          <Card.Body>
            <HistoryCurve from={pointsUpdateDate} value={stats.history} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Page;

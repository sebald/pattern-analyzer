import { notFound } from 'next/navigation';

import { pointsUpdateDate } from '@/lib/config';
import { getFactionCount, getSquads } from '@/lib/db/squads';
import { getPilotName } from '@/lib/get-value';
import { createMetadata } from '@/lib/metadata';
import { PilotStats, pilotDetails } from '@/lib/stats/details/pilot';
import { fromDate } from '@/lib/utils/date.utils';

// Config
// ---------------
export const revalidate = 21600; // 6 hours

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = async () => {
  // TODO
  return [];
};

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

  return <div>{JSON.stringify(stats)}</div>;
};

export default Page;

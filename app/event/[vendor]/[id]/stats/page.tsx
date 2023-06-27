import { BASE_URL } from '@/lib/env';
import type { SquadData, Vendor } from '@/lib/types';

import { StatsView } from './(views)/stats.view';
import { LongshanksStatsView } from './(views)/longshanks-stats.view';

// Data
// ---------------
interface GetSquadsProps {
  vendor: Vendor;
  id: string;
}

const getSquads = async ({ vendor, id }: GetSquadsProps) => {
  const res = await fetch(`${BASE_URL}/api/${vendor}/${id}/squads`);

  if (!res.ok) {
    throw new Error(`Failed to fetch squdas... (${vendor}/${id})`);
  }

  const squads = await res.json();
  return squads as SquadData[];
};

// Props
// ---------------
interface PageProps {
  params: {
    vendor: Vendor;
    id: string;
  };
}

// Components
// ---------------
const Page = async ({ params }: PageProps) => {
  if (params.vendor === 'longshanks') {
    return <LongshanksStatsView {...params} />;
  }

  const squads = await getSquads(params);
  return <StatsView squads={squads} />;
};

export default Page;

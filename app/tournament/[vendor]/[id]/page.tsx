import { baseUrl } from '@/lib/config';
import type { Vendor, SquadData } from '@/lib/types';

import { Rankings } from './_components/rankings';
import { LongshanksRankings } from './_components/longshank-rankings';

// Data
// ---------------
interface GetSquadsProps {
  vendor: Vendor;
  id: string;
}

const getSquads = async ({ vendor, id }: GetSquadsProps) => {
  const res = await fetch(`${baseUrl}/api/${vendor}/${id}/squads`);

  if (!res.ok) {
    throw new Error(`Failed to fetch squads... (${vendor}/${id})`);
  }

  const squads = await res.json();
  return squads as SquadData[];
};

// Props
// ---------------
interface PageParams {
  params: {
    vendor: Vendor;
    id: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  if (params.vendor === 'longshanks') {
    return <LongshanksRankings {...params} />;
  }

  const squads = await getSquads(params);
  return <Rankings squads={squads} />;
};

export default Page;

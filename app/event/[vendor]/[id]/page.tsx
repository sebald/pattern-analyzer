import { baseUrl } from '@/lib/config';
import { SquadData, Vendor } from '@/lib/types';

import { LongshanksSquadView } from './(views)/longshanks-squad.view';
import { SquadsView } from './(views)/squad.view';

// Data
// ---------------
interface GetSquadsProps {
  vendor: Vendor;
  id: string;
}

const getSquads = async ({ vendor, id }: GetSquadsProps) => {
  const res = await fetch(`${baseUrl}/api/${vendor}/${id}/squads`);

  if (!res.ok) {
    throw new Error(`Failed to fetch squdas... (${vendor}/${id})`);
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
    return <LongshanksSquadView {...params} />;
  }

  const squads = await getSquads(params);
  return <SquadsView squads={squads} />;
};

export default Page;

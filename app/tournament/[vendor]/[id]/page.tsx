import { baseUrl } from '@/lib/config';
import { SquadData, Vendor } from '@/lib/types';

import { LongshanksSquadView } from './_components/longshanks-squad.view';
import { SquadsView } from './_components/squad.view';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => [];

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
    return <LongshanksSquadView {...params} />;
  }

  const squads = await getSquads(params);
  return <SquadsView squads={squads} />;
};

export default Page;

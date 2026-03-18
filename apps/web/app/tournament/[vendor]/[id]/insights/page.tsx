import { baseUrl } from '@/lib/config';
import type { SquadData, Vendor } from '@/lib/types';

import { StatsView } from './_components/stats.view';

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
  const squads = await getSquads(params);
  return <StatsView squads={squads} />;
};

export default Page;

import { baseUrl } from '@/lib/config';
import { SquadData, Vendor } from '@/lib/types';

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
  params: Promise<{
    vendor: string;
    id: string;
  }>;
}

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  const { vendor, id } = await params;
  const squads = await getSquads({ vendor: vendor as Vendor, id });
  return <SquadsView squads={squads} />;
};

export default Page;

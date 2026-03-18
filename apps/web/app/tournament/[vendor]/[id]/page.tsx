import { baseUrl } from '@/lib/config';
import type { Vendor, SquadData } from '@/lib/types';

import { Rankings } from './_components/rankings';

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
  return <Rankings squads={squads} />;
};

export default Page;

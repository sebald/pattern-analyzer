import { baseUrl } from '@/lib/env';
import { SquadData, Vendor } from '@/lib/types';

import { FilterProvider } from './(views)/components/context';
import { Filter } from './(views)/components/filter';
import { Squads } from './(views)/components/squads';

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
  const { vendor, id } = params;

  if (vendor === 'longshanks') {
    return '...meh';
  }

  const squads = await getSquads({ vendor, id });
  return (
    <FilterProvider>
      <Filter />
      <Squads squads={squads} />
    </FilterProvider>
  );
};

export default Page;

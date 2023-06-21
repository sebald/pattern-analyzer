import { baseUrl } from '@/lib/env';
import { SquadData, Vendor } from '@/lib/types';

import { FilterProvider } from './(views)/components/context';
import { Filter } from './(views)/components/filter';
import { Squads } from './(views)/components/squads';
import { LongshanksSquadView } from './(views)/longshanks-squad.view';

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
  return (
    <FilterProvider>
      <Filter />
      <Squads squads={squads} />
    </FilterProvider>
  );
};

export default Page;

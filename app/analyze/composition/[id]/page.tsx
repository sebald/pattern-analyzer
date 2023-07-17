import { pointsUpdateDate } from '@/lib/config';
import { compositionDetails } from '@/lib/stats/details/composition';
import { fromDate } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { SquadList } from '@/ui/squad-list';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = async () => {
  const tournaments = await getAllTournaments({
    from: fromDate(pointsUpdateDate),
    format: 'standard',
  });

  const squads = await Promise.all(
    tournaments.map(({ id }) => getSquads({ id: `${id}` }))
  );

  const compositions = new Set<string>();
  squads.flat().forEach(({ xws }) => {
    if (!xws) return;

    const id = xws.pilots.map(({ ship }) => ship).join('.');
    compositions.add(id);
  });

  return [...compositions.values()].map(id => ({
    id,
  }));
};

// Data
// ---------------
const getCompositionStats = async (id: string, from: Date) => {
  const tournaments = await getAllTournaments({
    from,
    format: 'standard',
  });

  const squads = await Promise.all(
    tournaments.map(({ id }) => getSquads({ id: `${id}` }))
  );

  return compositionDetails(id, squads);
};

// Props
// ---------------
interface PageParams {
  params: {
    id: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  const stats = await getCompositionStats(
    params.id,
    fromDate(pointsUpdateDate)
  );

  return (
    <>
      <SquadList squads={stats.squads} />
    </>
  );
};

export default Page;

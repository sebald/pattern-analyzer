import { BASE_URL } from '@/lib/env';
import { ListfortressTournamentInfo, SquadData } from '@/lib/types';
import { Title } from '@/ui';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 10800; // 3 hours

// Data
// ---------------
const getRecentTournaments = async () => {
  const res = await fetch(`${BASE_URL}/api/listfortress`);

  if (!res.ok) {
    throw new Error('Failed to fetch listfortress data...');
  }

  const infos = (await res.json()) as ListfortressTournamentInfo[];

  const squads = await Promise.all(
    infos.map(async ({ id }) => {
      const r = await fetch(`${BASE_URL}/api/listfortress/${id}/squads`);

      if (!r.ok) {
        throw new Error('Failed to fetch squads...');
      }

      const squads = (await r.json()) as SquadData[];
      return squads;
    })
  );

  return squads;
};

// Page
// ---------------
const AnalyzePage = async () => {
  return (
    <header className="mb-4 border-b border-b-primary-100 pb-6 md:mt-3">
      <Title>Analyze</Title>
    </header>
  );
};

export default AnalyzePage;

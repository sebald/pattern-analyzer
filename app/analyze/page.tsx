import { BASE_URL } from '@/lib/env';
import { ListfortressTournamentInfo, SquadData } from '@/lib/types';
import { getAllTournaments } from '@/lib/vendor/listfortress';

import { Title } from '@/ui';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 10800; // 3 hours

// Data
// ---------------
const getStats = async () => {
  const events = await getAllTournaments({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    format: 'standard',
  });

  const res = await fetch(`${BASE_URL}/api/listfortress`);

  if (!res.ok) {
    throw new Error('Failed to fetch listfortress data...');
  }

  const infos = (await res.json()) as ListfortressTournamentInfo[];

  const events = await Promise.all(
    infos.map(async ({ id }) => {
      const r = await fetch(`${BASE_URL}/api/listfortress/${id}/squads`);

      if (!r.ok) {
        throw new Error('Failed to fetch squads...');
      }

      const event = (await r.json()) as SquadData[];
      return event;
    })
  );

  return events.reduce((stats, squads) => {
    const st = createStats({ squads });

    const next = {
      tournamentStats: {
        xws: stats.tournamentStats.xws + st.tournamentStats.xws,
        count: stats.tournamentStats.count + st.tournamentStats.count,
        cut: stats.tournamentStats.cut + st.tournamentStats.cut,
      },
    };

    return stats;
  }, setupStats());
};

// Page
// ---------------
const AnalyzePage = async () => {
  const squads = await getStats();
  return (
    <header className="mb-4 border-b border-b-primary-100 pb-6 md:mt-3">
      <Title>Analyze</Title>
      <pre>
        <code>{JSON.stringify(squads, null, 2)}</code>
      </pre>
    </header>
  );
};

export default AnalyzePage;

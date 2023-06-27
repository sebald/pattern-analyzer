import { BASE_URL } from '@/lib/env';
import { ListfortressTournamentInfo } from '@/lib/types';
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
    throw new Error('Failed to fetch recent events...');
  }

  const events = await res.json();
  return events as ListfortressTournamentInfo[];
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

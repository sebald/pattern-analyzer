import { RECENT_EVENTS } from 'app/preload';
import { Caption, Container, Link, Title } from 'components';
import { getEvent } from 'lib/longshanks';

// Friendly reminder: Don't use a barrel file! next doesn't like it!
import { Filter } from './components/filter';
import { FilterProvider } from './components/filter-context';
import { Squads } from './components/squads';
import { Stats } from './components/stats';
import { Tabs } from './components/tabs';

/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 60;
export const fetchCache = 'force-cache';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export async function generateStaticParams() {
  return RECENT_EVENTS.map(event => ({ event }));
}

// Props
// ---------------
export interface PageProps {
  params: {
    event: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageProps) => {
  const { title, url, squads } = await getEvent(params.event);
  const squadsWithXWS = squads.filter(item => Boolean(item.xws)).length;

  return (
    <main className="p-4">
      <Container>
        <header className="mb-8 border-b border-b-primary-100 pb-6 md:mb-24">
          <Title>{title || `Event #${params.event}`}</Title>
          <Caption>
            <Link href={url} target="_blank">
              Event #{params.event}
            </Link>{' '}
            ({squadsWithXWS}/{squads.length} squads parsed)
          </Caption>
        </header>
        <Tabs labels={['Squads', 'Stats']}>
          <FilterProvider>
            <Filter />
            <Squads squads={squads} />
          </FilterProvider>
          <Stats />
        </Tabs>
      </Container>
    </main>
  );
};

export default Page;

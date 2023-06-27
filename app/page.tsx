import { Container, Logo } from '@/ui';
import { cn } from '@/lib/utils';

import { montserrat } from './fonts';
import { EventForm } from './components/event-form';
import { RecentEvents } from './components/recent-events';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const dynamic = 'force-static';

// Page
// ---------------
const Home = async () => (
  <Container className="grid flex-1 place-items-center">
    <div>
      <h1
        className={cn(
          montserrat.variable,
          'prose flex items-center justify-center pb-20 pt-8 font-headline text-2xl font-extrabold uppercase text-primary-900 md:pb-14'
        )}
      >
        <Logo className="h-10 w-10" />
        Pattern Analyzer
      </h1>
      <div className="flex-1 pb-24">
        <EventForm />
      </div>
      <RecentEvents />
    </div>
  </Container>
);

export default Home;

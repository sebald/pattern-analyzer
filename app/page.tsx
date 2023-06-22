import { Card, Container, Link, List, Logo } from '@/ui';
import { BASE_URL, RECENT_EVENTS } from '@/lib/env';
import { cn, getJson } from '@/lib/utils';

import { montserrat } from './fonts';
import { EventForm } from './components/event-form';
import { EventInfo } from '@/lib/types';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const dynamic = 'force-static';

// Data
// ---------------
const getReventEvents = async () => {
  const events = await Promise.all(
    RECENT_EVENTS.map(({ vendor, id }) =>
      getJson(`${BASE_URL}/api/${vendor}/${id}`)
    )
  );
  return events as EventInfo[];
};

// Page
// ---------------
const Home = async () => {
  const events = await getReventEvents();

  return (
    <Container className="grid flex-1 place-items-center">
      <div>
        <h1
          className={cn(
            montserrat.variable,
            'prose flex items-center justify-center pt-8 font-headline text-2xl font-extrabold uppercase text-primary-900 md:pb-14',
            events.length > 0 ? 'pb-20' : 'pb-6'
          )}
        >
          <Logo className="h-10 w-10" />
          Pattern Analyzer
        </h1>
        <div className="flex-1">
          <EventForm />
        </div>
        {events.length > 0 && (
          <div className="w-full pt-24 md:px-6">
            <h2
              className={`${montserrat.variable} prose pb-2 font-headline font-bold uppercase text-primary-400`}
            >
              Recent Events
            </h2>
            <Card>
              <List variant="wide">
                {events.map(({ id, vendor, name, date }) => (
                  <List.Item key={id}>
                    <Link
                      className="text-lg text-secondary-900"
                      href={`/event/${vendor}/${id}`}
                    >
                      <h3 className="font-medium">{name}</h3>
                      <div className="text-sm text-secondary-500">{date}</div>
                    </Link>
                  </List.Item>
                ))}
              </List>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Home;

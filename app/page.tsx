import { Card, Collapsible, Container, Headline, Link, List, Logo } from '@/ui';
import { getAllTournaments } from '@/lib/vendor/listfortress';
import { cn } from '@/lib/utils';

import { headline } from './fonts';
import { EventForm } from './components/event-form';
import { daysAgo } from '@/lib/utils/date.utils';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 10800; // 3 hours

// Data
// ---------------
const getReventEvents = async () => {
  const events = await getAllTournaments({
    from: daysAgo(20),
    format: 'standard',
  });

  events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return events;
};

// Page
// ---------------
const Home = async () => {
  const events = await getReventEvents();

  return (
    <div className="container grid flex-1 place-items-center">
      <div className="flex-1 pb-24">
        <Headline level="3" className="text-primary-800">
          Find an Event:
        </Headline>
        <EventForm />
      </div>
      <div className="w-full md:px-6">
        <Headline level="3" className="text-primary-800">
          Recent Events
        </Headline>
        <Card>
          <Collapsible maxHeight={350}>
            <List variant="wide">
              {events.map(({ id, name, date, country }) => (
                <List.Item key={id}>
                  <Link
                    className="text-lg text-secondary-900"
                    href={`/event/listfortress/${id}`}
                  >
                    <h3 className="font-medium">{name}</h3>
                    <div className="text-sm text-secondary-400">
                      {date}
                      {country ? `, ${country}` : ''}
                    </div>
                  </Link>
                </List.Item>
              ))}
            </List>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};

export default Home;

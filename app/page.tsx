import { Card, Container, Link, Logo } from 'components';
import { List } from 'components/list';
import { getEventInfo } from 'lib/longshanks';

import { montserrat } from './fonts';
import { RECENT_EVENTS } from './preload';
import { EventForm } from './components/event-form';

/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 3600; // 1 day
export const fetchCache = 'force-cache';

// Page
// ---------------
const Home = async () => {
  const data = await Promise.all(RECENT_EVENTS.map(getEventInfo));

  return (
    <Container>
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center">
          <div className="pb-14">
            <Logo />
          </div>
          <EventForm />
          {data.length > 0 && (
            <div className="w-full pt-20 md:px-6">
              <h2
                className={`${montserrat.className} prose pb-2 font-bold uppercase text-primary-400`}
              >
                Recent Events
              </h2>
              <Card>
                <List>
                  {data.map(({ id, title, date }) => (
                    <List.Item key={id}>
                      <Link
                        className="text-lg text-secondary-900"
                        href={`/event/${id}`}
                      >
                        <h3 className="font-medium">{title}</h3>
                        <div className="text-sm text-secondary-500">{date}</div>
                      </Link>
                    </List.Item>
                  ))}
                </List>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Home;

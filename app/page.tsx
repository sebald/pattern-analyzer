import { Card, Container, Link, List, Logo } from 'components';
import { getEventInfo } from 'lib/longshanks';
import { EventForm } from './components/event-form';
import { EVENT_IDS } from './constants';

/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 3600; // 1 day
export const fetchCache = 'force-cache';

// Page
// ---------------
const Home = async () => {
  const data = await Promise.all(EVENT_IDS.map(getEventInfo));
  console.log(data);
  return (
    <Container>
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center">
          <div className="pb-14">
            <Logo />
          </div>
          <EventForm />
          {data.length > 0 && (
            <div className="w-full px-6 pt-20">
              <h2 className="prose pb-2 font-bold text-primary-900">
                Recent Events
              </h2>
              <Card>
                <List>
                  {data.map(({ id, title, date }) => (
                    <List.Item key={id}>
                      <Link
                        className="text-lg text-secondary-900"
                        href={`/${id}`}
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

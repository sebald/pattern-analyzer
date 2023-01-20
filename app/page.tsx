import { Card, Container, List, Logo } from 'components';
import { EventForm } from './components/event-form';

const Home = () => {
  return (
    <Container>
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center">
          <div className="pb-14">
            <Logo />
          </div>
          <EventForm />
          <div className="w-full px-6 pt-20">
            <h2 className="prose pb-2 font-bold text-primary-900">
              Recent Events
            </h2>
            <Card>
              <List>
                <List.Item>Event 1</List.Item>
                <List.Item>Event 2</List.Item>
                <List.Item>Event 3</List.Item>
              </List>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;

import { Headline } from '@/ui';

const Home = () => {
  return (
    <div className="grid-stack container hidden place-items-center md:grid">
      <div className="bg-blur-gradient h-[250px] lg:h-[300px]" />
      <div className="z-10 text-center">
        <Headline
          level="1"
          className="max-w-screen-lg text-balance text-primary-900 md:text-7xl lg:text-8xl"
        >
          Welcome to Pattern Analyzer
        </Headline>
        <div className="mx-auto text-balance pt-8 text-lg text-primary-900/70 lg:w-[50vw] lg:text-xl">
          Explore tournament results and dive into statistics of ship
          compositions, pilots, and upgrades.
        </div>
      </div>
    </div>
  );
};

export default Home;

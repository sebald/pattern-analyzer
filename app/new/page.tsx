import { headline } from '@/app/fonts';
import { Card } from '@/ui';

// Config
// ---------------
export const revalidate = 43200; // 12 hours

// Page
// ---------------
const Home = () => {
  return (
    <div className="container flex flex-col gap-24 md:gap-32">
      <div className="flex flex-col gap-4">
        <div className="grid-stack grid place-items-center lg:mt-4">
          <div className="bg-blur-gradient h-[250px] lg:h-[300px] xl:h-[320px]" />
          <div
            className={`${headline.variable} z-10 max-w-screen-lg text-center font-headline uppercase`}
          >
            <div className="text-xl font-bold text-primary-900/80 md:text-2xl">
              Welcome to
            </div>
            <div className="text-7xl font-extrabold !leading-[0.9] text-primary-900 md:text-8xl lg:text-9xl">
              Pattern Analyzer
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-screen-md pt-8 text-center text-lg text-primary-900 md:text-2xl md:opacity-70">
          Explore tournament results and dive into statistics of ship
          compositions, pilots, and upgrades.
        </div>
      </div>
      <Card inset="headless">asd</Card>
    </div>
  );
};

export default Home;

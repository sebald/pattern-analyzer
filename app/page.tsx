import { headline } from '@/app/fonts';

import { SearchForm } from './_components/search-form';
import { BarChart, Trophy, User, UserGroup } from '@/ui/icons';
import { Hero } from './_components/hero-card';

// Config
// ---------------
export const revalidate = 43200; // 12 hours

// Page
// ---------------
const Home = () => {
  return (
    <div className="container flex flex-col gap-24 md:gap-32">
      <div className="flex flex-col gap-4">
        <div className="grid-stack grid place-items-center">
          <div className="bg-blur-gradient h-[150px] sm:h-[250px] lg:h-[300px] xl:h-[320px]" />
          <div
            className={`${headline.variable} z-10 max-w-screen-lg text-center font-headline uppercase`}
          >
            <div className="text-xl font-bold text-primary-900/70 md:text-2xl">
              Welcome to
            </div>
            <div className="text-5xl font-extrabold !leading-[0.9] text-primary-900 shadow-primary-700 text-shadow-xs sm:text-7xl md:text-8xl lg:text-9xl">
              Pattern Analyzer
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-screen-md pt-8 text-center text-lg text-primary-900 md:text-2xl md:opacity-70">
          Elevate your gaming with tournament results, meta insights, pilot
          stats, and winning compositions.
        </div>
      </div>
      <div className="mx-auto flex max-w-screen-sm flex-col gap-2">
        <div className="text-sm font-medium text-secondary-700">
          View Tournament:
        </div>
        <SearchForm />
      </div>
      <div className="mx-auto grid gap-4 lg:grid-cols-2">
        <Hero.Card className="ml-14">
          <Hero.Icon>
            <Trophy className="size-12" />
          </Hero.Icon>
          <Hero.Title>Tournaments</Hero.Title>
          <Hero.Body>
            Dive into the heart of the action with tournaments coverage,
            delivering the latest results and insightful analyses. Uncover the
            evolving meta with in-depth insights, providing a front-row seat to
            the ever-shifting landscape of competitive play.
          </Hero.Body>
        </Hero.Card>
        <Hero.Card>
          <Hero.Icon>
            <BarChart className="size-12" />
          </Hero.Icon>
          <Hero.Title>Insights</Hero.Title>
          <Hero.Body>
            Embark on a statistical journey as we dissect factional prowess in
            competitive gaming. Uncover which factions reign supreme and gain
            strategic foresight. Elevate your gameplay with concise yet powerful
            insights. Stay ahead of the competition - it&apos;s not just about
            winning; it&apos;s about knowing how.
          </Hero.Body>
        </Hero.Card>
        <Hero.Card>
          <Hero.Icon>
            <UserGroup className="size-12" />
          </Hero.Icon>
          <Hero.Title>Compositions</Hero.Title>
          <Hero.Body>
            Discover winning compositions that dominate the meta and propel
            yourself to victory. Our detailed breakdowns showcase the squads
            that stand out, offering strategic insights to elevate your own
            gameplay.
          </Hero.Body>
        </Hero.Card>
        <Hero.Card>
          <Hero.Icon>
            <User className="size-12" />
          </Hero.Icon>
          <Hero.Title>Pilots</Hero.Title>
          <Hero.Body>
            Explore detailed pilot statistics that go beyond the surface,
            offering a deep dive into the performance metrics that matter. From
            win rates to game-changing loadouts, we have got you covered.
          </Hero.Body>
        </Hero.Card>
      </div>
      <div className="mx-auto w-2/3 text-sm italic text-primary-900/40">
        <span className="font-bold">Disclaimer:</span> Please be advised that
        all statements made herein are presented without any explicit guarantee.
        We want to emphasize that individual experiences can differ
        significantly, and outcomes may vary based on numerous factors.
      </div>
    </div>
  );
};

export default Home;

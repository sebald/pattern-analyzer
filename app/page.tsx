import { headline } from '@/app/fonts';

import { SearchForm } from './_components/search-form';
import { BarChart, ChevronDown, Trophy, User, UserGroup } from '@/ui/icons';
import { Hero } from './_components/hero-card';
import { Link } from '@/ui';

// Config
// ---------------
export const revalidate = 43200; // 12 hours

// Page
// ---------------
const Home = () => {
  return (
    <div className="container flex flex-col gap-24 md:gap-32 lg:gap-44">
      <div className="flex flex-col gap-4 pt-8 md:pt-0">
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
      <div className="mx-auto grid gap-6 lg:w-11/12 lg:grid-cols-2">
        <Hero.Card>
          <Hero.Icon>
            <Trophy className="size-12" />
          </Hero.Icon>
          <Hero.Title>Tournaments</Hero.Title>
          <Hero.Body>
            Dive into the action with tournaments coverage, delivering the
            latest results and insightful analyses. Uncover the evolving meta
            with in-depth insights, navigating the competitive landscape.
          </Hero.Body>
          <Hero.Link href="/tournament">View Tournaments</Hero.Link>
        </Hero.Card>
        <Hero.Card>
          <Hero.Icon>
            <BarChart className="size-12" />
          </Hero.Icon>
          <Hero.Title>Insights</Hero.Title>
          <Hero.Body>
            Discover top-performing factions, gain strategic foresight, and
            elevate your gameplay with powerful insights. Stay ahead – it&apos;s
            not just about winning; it&apos;s about knowing how.
          </Hero.Body>
          <Hero.Link href="/insights">View Insights</Hero.Link>
        </Hero.Card>
        <Hero.Card>
          <Hero.Icon>
            <UserGroup className="size-12" />
          </Hero.Icon>
          <Hero.Title>Compositions</Hero.Title>
          <Hero.Body>
            Uncover winning compositions that dominate the meta and give
            yourself a strategic edge. Examine detailed breakdowns that
            spotlight standout squads, offering strategic insights.
          </Hero.Body>
          <Hero.Link href="/composition">View Compositions</Hero.Link>
        </Hero.Card>
        <Hero.Card>
          <Hero.Icon>
            <User className="size-12" />
          </Hero.Icon>
          <Hero.Title>Pilots</Hero.Title>
          <Hero.Body>
            Explore pilot stats beyond the surface, from win rates to
            game-changing loadouts. We&apos;ve got you covered with all the
            performance metrics.
          </Hero.Body>
          <Hero.Link href="/pilot">View Pilots</Hero.Link>
        </Hero.Card>
        <div className="col-span-full mx-auto w-2/3 pb-12 text-sm italic text-primary-900/40">
          <span className="font-bold">Disclaimer:</span> Please be advised that
          all statements made herein are presented without any explicit
          guarantee. We want to emphasize that individual experiences can differ
          significantly, and outcomes may vary based on numerous factors.
        </div>
      </div>
    </div>
  );
};

export default Home;

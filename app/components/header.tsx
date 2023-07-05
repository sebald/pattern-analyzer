import { MobileNavigation } from './mobile-navigation';
import { Navigation } from './navigation';

export const SiteHeader = () => (
  <header className="w-full border border-b border-primary-200">
    <div className="container flex h-12 items-center gap-4 md:h-14">
      <MobileNavigation />
      <Navigation />
    </div>
  </header>
);

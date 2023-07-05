import { MobileNavigation } from './mobile-navigation';

export const SiteHeader = () => (
  <header className="w-full border border-b border-primary-200">
    <div className="container flex h-12 items-center gap-4">
      <MobileNavigation />
    </div>
  </header>
);

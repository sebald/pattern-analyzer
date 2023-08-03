import { Container } from '@/ui';

import { MobileNavigation } from './mobile-navigation';
import { SiteNavigation } from './site-navigation';

export const SiteHeader = () => (
  <header className="w-full border border-b border-primary-200">
    <Container className="flex h-12 items-center gap-4 md:h-14">
      <MobileNavigation />
      <SiteNavigation />
    </Container>
  </header>
);

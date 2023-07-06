import { Link, Logo } from '@/ui';
import { secondaryNavigation, siteNavigation } from '@/lib/config';
import { cn } from '@/lib/utils';

import { headline } from '../fonts';

export const SiteNavigation = () => {
  return (
    <div className="hidden w-full md:flex">
      <Link
        href="/"
        className={cn(
          headline.variable,
          'prose mr-10 flex items-center gap-1 font-headline font-extrabold uppercase text-primary-900 hover:text-primary-700'
        )}
      >
        <Logo className="h-6 w-6" />
        Pattern Analyzer
      </Link>
      <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
        {siteNavigation.map(({ name, href }) => (
          <Link
            key={href}
            href={href}
            className="text-sm font-normal text-primary-900/75 hover:text-primary-900"
          >
            {name}
          </Link>
        ))}
        <span className="grow" role="separator" aria-hidden="true" />
        {secondaryNavigation.map(({ name, href }) => (
          <Link
            key={href}
            href={href}
            className="text-sm font-normal text-primary-900/75 hover:text-primary-900"
          >
            {name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

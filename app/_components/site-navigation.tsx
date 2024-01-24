import { Link, Logo } from '@/ui';
import { secondaryNavigation, siteNavigation } from '@/lib/config';
import { cn } from '@/lib/utils/classname.utils';

import { headline } from '../fonts';

// Helper
// ---------------
interface NavLinkProps {
  name: string;
  href: string;
  className?: string;
}

const NavLink = ({ name, href, className }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      'py-2 text-sm font-normal text-primary-900/75 first:pl-0 last:pr-0 hover:text-primary-900',
      className
    )}
  >
    {name}
  </Link>
);

// Component
// ---------------
export const SiteNavigation = () => {
  return (
    <div className="hidden w-full md:flex">
      <Link
        href="/"
        className={cn(
          headline.variable,
          'prose mr-10 flex items-center gap-1 whitespace-nowrap font-headline font-extrabold uppercase text-primary-900 hover:text-primary-700'
        )}
      >
        <Logo className="h-6 w-6" />
        <span className="hidden lg:inline">Pattern Analyzer</span>
      </Link>
      <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
        {siteNavigation.map(({ name, href }) => (
          <NavLink key={href} href={href} name={name} />
        ))}
        <span className="grow" role="separator" aria-hidden="true" />
        {secondaryNavigation.map(({ name, href }) => (
          <NavLink key={href} href={href} name={name} />
        ))}
      </nav>
    </div>
  );
};

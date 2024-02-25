import Image from 'next/image';
import { Container, Link } from '@/ui';
import {
  secondaryNavigation,
  siteNavigation,
  xWingResources,
} from '@/lib/config';

export const SiteFooter = () => (
  <footer className="border border-b border-primary-200 px-4 pb-6 pt-10 md:pt-16">
    <Container className="flex pb-14 text-sm text-primary-900/60">
      <div className="flex-1">
        <div className="pb-2 text-xs font-bold uppercase text-primary-600">
          Navigation
        </div>
        <div className="flex gap-x-14 md:gap-x-28 lg:gap-x-36">
          <div className="flex flex-col gap-2">
            {siteNavigation.map(({ name, href }) => (
              <Link key={href} href={href}>
                {name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {secondaryNavigation.map(({ name, href }) => (
              <Link key={href} href={href}>
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden flex-1 lg:block">
        <div className="pb-2 text-xs font-bold uppercase text-primary-600">
          X-Wing Resources
        </div>
        <div className="flex flex-col gap-2">
          {xWingResources.map(({ name, href }) => (
            <Link key={href} href={href}>
              {name}
            </Link>
          ))}
        </div>
      </div>
    </Container>
    <Container className="flex flex-col items-center justify-between gap-8 md:flex-row">
      <p className="text-xs text-secondary-500">
        This is an unofficial website. It is not affiliated with Atomic Mass
        Games, Lucasfilm Ltd., or Disney.
      </p>
      <a
        href="https://vercel.com/?utm_source=sebald&utm_campaign=oss"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          src="/powered-by-vercel.svg"
          alt="Powered by Vercel"
          width={159}
          height={33}
        />
      </a>
    </Container>
  </footer>
);

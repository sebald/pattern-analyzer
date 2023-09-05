import Image from 'next/image';

import { Container } from '@/ui';
import { ago } from '@/lib/utils/date.utils';

export interface SiteFooterProps {
  lastUpdate: Date;
}

export const SiteFooter = ({ lastUpdate }: SiteFooterProps) => (
  <footer className="border border-b border-primary-200 px-4 py-6">
    <Container className="flex flex-col items-center justify-between gap-8 md:flex-row">
      <p className="text-sm text-secondary-600">
        Updated {ago(lastUpdate)} ago.
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

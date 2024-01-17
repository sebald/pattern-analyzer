import Image from 'next/image';
import { Container } from '@/ui';

export const SiteFooter = () => (
  <footer className="border border-b border-primary-200 px-4 py-6">
    <Container className="flex flex-col items-center justify-between gap-8 md:flex-row">
      <p className="text-sm text-secondary-600">
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

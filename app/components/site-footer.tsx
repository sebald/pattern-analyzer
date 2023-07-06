import Image from 'next/image';

export const SiteFooter = () => (
  <footer className="mt-10 border border-b border-primary-200 px-4 py-6">
    <div className="container flex items-center justify-between gap-8">
      <p className="text-sm text-secondary-600">
        The source code is available on{' '}
        <a
          href="https://github.com/sebald/pattern-analyzer/"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </a>
        .
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
    </div>
  </footer>
);

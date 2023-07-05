import Image from 'next/image';

export const SiteFooter = () => (
  <footer className="mt-10 border border-b border-primary-200 px-4 py-6">
    <div className="container flex items-center gap-8">
      <Image
        src="/powered-by-vercel.svg"
        alt="Powered by Vercel"
        width={159}
        height={33}
      />
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
    </div>
  </footer>
);

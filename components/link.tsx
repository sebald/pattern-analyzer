import { ComponentProps } from 'react';
import NextLink from 'next/link';

export interface LinksProps extends ComponentProps<typeof NextLink> {}

export const Link = ({ children, className = '', ...props }: LinksProps) => (
  <NextLink
    {...props}
    className={`flex cursor-pointer items-center gap-1 hover:text-primary-600 ${className}`}
  >
    {children}
  </NextLink>
);

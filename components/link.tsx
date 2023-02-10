import { ComponentProps } from 'react';
import NextLink from 'next/link';

export interface LinksProps extends ComponentProps<typeof NextLink> {}

export const Link = ({ children, className = '', ...props }: LinksProps) => (
  <NextLink
    {...props}
    className={`cursor-pointer hover:text-primary-600 ${className}`}
  >
    {children}
  </NextLink>
);

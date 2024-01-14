import type { ReactNode } from 'react';
import { Title } from '@/ui';

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Title className="pb-6">Tournaments</Title>
    {children}
  </>
);

export default Layout;

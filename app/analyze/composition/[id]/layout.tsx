import type { ReactNode } from 'react';
import { Title } from '@/ui';

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <div className="pb-6">
      <Title>Composition Details</Title>
    </div>
    <div>{children}</div>
  </>
);

export default Layout;

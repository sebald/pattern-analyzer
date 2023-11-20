import type { ReactNode } from 'react';

import { Title } from '@/ui';
import { getPilotName } from '@/lib/get-value';

// Props
// ---------------
interface LayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

// Layout
// ---------------
const Layout = ({ children, params }: LayoutProps) => (
  <>
    <div className="pb-6">
      <Title>{getPilotName(params.id) || params.id}</Title>
    </div>
    <div>{children}</div>
  </>
);

export default Layout;

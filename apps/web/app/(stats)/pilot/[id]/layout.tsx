import type { ReactNode } from 'react';

import { Title } from '@/ui';
import { getPilotName } from '@pattern-analyzer/xws';
import { Filter } from '@/ui/params/filter';
import { SmallSamplesFilter } from '@/ui/params/small-samples-filter';

// Props
// ---------------
interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    id: string;
  }>;
}

// Layout
// ---------------
const Layout = async ({ children, params }: LayoutProps) => {
  const { id } = await params;

  return (
  <>
    <div className="flex flex-col justify-between gap-x-8 gap-y-6 pb-6 md:flex-row md:items-end">
      <Title>{getPilotName(id) || id}</Title>
      <Filter className="pb-0">
        <SmallSamplesFilter />
      </Filter>
    </div>
    {children}
  </>
  );
};

export default Layout;

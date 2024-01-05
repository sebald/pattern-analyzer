import type { ReactNode } from 'react';

import { Title } from '@/ui';
import { getPilotName } from '@/lib/get-value';
import { Filter } from '@/ui/params/filter';
import { SmallSamplesFilter } from '@/ui/params/small-samples-filter';

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
    <div className="flex flex-col justify-between gap-x-8 gap-y-6 pb-6 md:flex-row md:items-end">
      <Title>{getPilotName(params.id) || params.id}</Title>
      <Filter className="pb-0">
        <SmallSamplesFilter />
      </Filter>
    </div>
    {children}
  </>
);

export default Layout;

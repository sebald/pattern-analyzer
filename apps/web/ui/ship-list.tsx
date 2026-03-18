import { XWSSquad } from '@/lib/types';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { ShipIcon } from './ship-icon';

// Styles
// ---------------
const styles = cva('flex items-center gap-0.5', {
  variants: {
    size: {
      small: 'text-lg',
      regular: 'text-2xl',
      large: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'regular',
  },
});

// Props
// ---------------
export interface ShipListProps extends VariantProps<typeof styles> {
  xws: XWSSquad | null;
}

// Component
// ---------------
export const ShipList = ({ xws, size }: ShipListProps) => {
  if (!xws) {
    return 'N/A';
  }

  const ships = xws.pilots.map(p => [p.id, p.ship]);
  ships.sort(([, a], [, b]) => a.localeCompare(b));

  return (
    <div className={styles({ size })}>
      {ships.map(([pid, ship]) => (
        <ShipIcon key={pid} ship={ship} />
      ))}
    </div>
  );
};

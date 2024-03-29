import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils/classname.utils';
import { getPilotName, getShipName } from '@/lib/get-value';
import type { XWSSquad } from '@/lib/types';
import { upgradesToList } from '@/lib/xws';

// Helper
// ---------------
const styles = {
  container: cva('flex flex-col', {
    variants: {
      variant: {
        narrow: 'gap-2.5',
        default: 'gap-4',
      },
      size: {
        default: '',
        small: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }),
  pilot: cva('flex items-center font-semibold', {
    variants: {
      variant: {
        narrow: 'leading-none',
        default: 'pb-1',
      },
      size: {
        default: '',
        small: 'text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }),
};

// Props
// ---------------
export interface SquadProps extends VariantProps<typeof styles.container> {
  className?: string;
  xws: XWSSquad;
}

// Component
// ---------------
export const Squad = ({ variant, size, className, xws }: SquadProps) => {
  const { pilots } = xws;

  return (
    <div className={cn(styles.container({ variant, size }), className)}>
      {pilots.map(({ id, ship, upgrades }, idx) => (
        <div key={`${id}-${idx}`}>
          <div
            className={styles.pilot({ variant, size })}
            title={`Ship: ${getShipName(ship) || ship}`}
          >
            {getPilotName(id) || id}
          </div>
          {upgrades && (
            <div className="prose text-sm text-secondary-500">
              {upgradesToList(upgrades)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

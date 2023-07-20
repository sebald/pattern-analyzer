import { VariantProps, cva } from 'class-variance-authority';

import { getPilotName, getShipName, getUpgradeName } from '@/lib/get-value';
import type { XWSSquad, XWSUpgrades } from '@/lib/types';

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
  pilot: cva('flex items-center font-semibold text-secondary-900', {
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

const upgradesToList = (upgrades: XWSUpgrades) =>
  (Object.entries(upgrades) as [keyof XWSUpgrades, string[]][])
    .map(([_, list]) => list.map(name => getUpgradeName(name) || name))
    .flat()
    .join(', ');

// Props
// ---------------
export interface SquadProps extends VariantProps<typeof styles.container> {
  xws: XWSSquad;
}

// Component
// ---------------
export const Squad = ({ variant, size, xws }: SquadProps) => {
  const { pilots } = xws;

  return (
    <div className={styles.container({ variant, size })}>
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

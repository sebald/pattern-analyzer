import { xwingShips } from 'app/fonts';
import icons from '@pattern-analyzer/xws/data/ship-icons';
import { getShipName } from '@pattern-analyzer/xws/get-value';
import { cn } from '@/lib/utils/classname.utils';

// Props
// ---------------
export interface ShipComponentProps {
  ship: string;
  className?: string;
}

// Usage in HTML
// ---------------
export interface ShipIconProps
  extends ShipComponentProps,
    React.ComponentPropsWithoutRef<'span'> {}

export const ShipIcon = ({ ship, className, ...props }: ShipIconProps) => (
  <span
    {...props}
    title={getShipName(ship) || ship}
    className={cn(xwingShips.className, className, 'leading-none')}
  >
    {(icons as any)[ship] || ship}
  </span>
);

// Usage in SVG
// ---------------
export interface ShipTextProps
  extends ShipComponentProps,
    React.ComponentPropsWithoutRef<'text'> {}

export const ShipText = ({ ship, className, ...props }: ShipTextProps) => (
  <text
    {...props}
    className={cn('cursor-default', xwingShips.className, className)}
  >
    {(icons as any)[ship] || ship}
    <title>{getShipName(ship) || ship}</title>
  </text>
);

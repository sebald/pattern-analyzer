import { xwingShips } from 'app/fonts';
import icons from 'lib/data/ship-icons.json';
import { cn } from 'lib/utils';

export interface ShipIconProps extends React.ComponentPropsWithoutRef<'span'> {
  ship: string;
  className?: string;
}

export const ShipIcon = ({ ship, className, ...props }: ShipIconProps) => (
  <span {...props} className={cn(xwingShips.className, className)}>
    {(icons as any)[ship] || ship}
  </span>
);

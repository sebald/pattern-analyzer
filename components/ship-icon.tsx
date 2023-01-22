import { xwingShips } from 'app/fonts';
import icons from 'lib/data/ship-icons.json';

export interface ShipIconProps {
  ship: string;
  className?: string;
}

export const ShipIcon = ({ ship, className }: ShipIconProps) => (
  <span className={`${xwingShips.className} ${className}`}>
    {(icons as any)[ship] || ship}
  </span>
);

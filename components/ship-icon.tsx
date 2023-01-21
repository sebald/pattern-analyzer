import { xwingShips } from 'app/fonts';
import map from 'lib/data/ship-font.json';

export interface ShipIconProps {
  ship: string;
}

export const ShipIcon = ({ ship }: ShipIconProps) => {
  const children = (map as any)[ship];
  console.log(ship, children);
  if (!children) {
    return null;
  }

  return <div className={`${xwingShips.className}`}>{children}</div>;
};

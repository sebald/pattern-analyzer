import { xwingShips } from 'app/fonts';
import icons from '@/lib/data/ship-icons.json';
import { cn } from '@/lib/utils';

export interface ShipIconProps extends React.HTMLAttributes<any> {
  as?: 'span' | 'text';
  ship: string;
  className?: string;
}

export const ShipIcon = ({
  as = 'span',
  ship,
  className,
  ...props
}: ShipIconProps) => {
  const Component = as;

  return (
    <Component {...props} className={cn(xwingShips.className, className)}>
      {(icons as any)[ship] || ship}
    </Component>
  );
};

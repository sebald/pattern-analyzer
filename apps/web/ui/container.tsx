import { cn } from '@/lib/utils/classname.utils';

// Props
// ---------------
export interface ContainerProps {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
}

// Component
// ---------------
export const Container = ({
  as: Component = 'div',
  children,
  className,
}: ContainerProps) => (
  <Component className={cn('container md:px-8', className)}>
    {children}
  </Component>
);

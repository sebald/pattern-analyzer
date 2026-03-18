import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/classname.utils';

// Styles
// ---------------
const styles = cva(['mb-1 block font-medium text-secondary-700'], {
  variants: {
    size: {
      small: 'text-xs',
      regular: 'text-sm',
      large: 'text-base',
      huge: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'regular',
  },
});

// Props
// ---------------
export interface LabelProps
  extends VariantProps<typeof styles>,
    React.ComponentPropsWithoutRef<'label'> {
  children: React.ReactNode;
}

// Component
// ---------------
export const Label = ({ children, size, className, ...props }: LabelProps) => (
  <label {...props} className={cn(styles({ size, className }))}>
    {children}
  </label>
);

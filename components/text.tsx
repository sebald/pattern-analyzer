import { cva, VariantProps } from 'class-variance-authority';

// Styles
// ---------------
const styles = cva(['leading-6]'], {
  variants: {
    space: {
      default: '[&:not(:last-child)]:mb-6',
      half: '[&:not(:last-child)]:mb-3',
      none: '',
    },
  },
  defaultVariants: {
    space: 'default',
  },
});

// Props
// ---------------
export interface TextProps extends VariantProps<typeof styles> {
  className?: string;
  children?: React.ReactNode;
  as?: 'p' | 'span';
}

// Component
// ---------------
export const Text = ({ as = 'p', space, className, children }: TextProps) => {
  const Element = as as keyof JSX.IntrinsicElements;
  return <Element className={styles({ space, className })}>{children}</Element>;
};

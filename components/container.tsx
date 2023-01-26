import { cva, VariantProps } from 'class-variance-authority';

// Styles
// ---------------
const styles = cva(['mx-auto'], {
  variants: {
    size: {
      regular: 'w-[min(100%_-_1.5rem,_75rem)]',
      narrow: 'w-[min(100%_-_1.5rem,_50rem)]',
    },
  },
  defaultVariants: {
    size: 'regular',
  },
});

// Props
// ---------------
export interface ContainerProps extends VariantProps<typeof styles> {
  children: React.ReactNode;
  className?: string;
}

// Component
// ---------------
export const Container = ({
  children,
  className,
  size = 'regular',
}: ContainerProps) => (
  <div className={styles({ size, className })}>{children}</div>
);

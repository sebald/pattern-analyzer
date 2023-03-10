import { ComponentPropsWithoutRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

// Styles
// ---------------
const styles = cva(['scroll-m-20 tracking-tight'], {
  variants: {
    level: {
      '1': 'text-4xl font-extrabold lg:text-5xl',
      '2': 'pb-5 text-3xl font-semibold first:mt-0',
      '3': 'pb-5 text-2xl font-semibold',
      '4': 'text-xl font-semibold',
      '5': 'text-base font-semibold',
    },
  },
  defaultVariants: {
    level: '1',
  },
});

// Props
// ---------------
export interface HeadlineProps
  extends VariantProps<typeof styles>,
    ComponentPropsWithoutRef<'h1'> {
  className?: string;
  children?: React.ReactNode;
}

// Component
// ---------------
export const Headline = ({
  level,
  className,
  children,
  ...props
}: HeadlineProps) => {
  const Element = `h${level}` as any;
  return (
    <Element className={styles({ level, className })} {...props}>
      {children}
    </Element>
  );
};

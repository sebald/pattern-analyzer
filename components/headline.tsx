import { ComponentPropsWithoutRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { montserrat } from '@/app/fonts';

// Styles
// ---------------
const styles = cva([`${montserrat.className} scroll-m-20`], {
  variants: {
    level: {
      '1': 'text-4xl font-extrabold lg:text-5xl tracking-tight',
      '2': 'pb-5 text-3xl font-bold first:mt-0 tracking-tight',
      '3': 'pb-5 text-2xl font-bold',
      '4': 'text-xl font-bold',
      '5': 'text-base font-bold',
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

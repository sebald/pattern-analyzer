import { ComponentPropsWithoutRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { headline } from '@/app/fonts';
import { cn } from '@/lib/utils';

// Styles
// ---------------
const styles = cva(['scroll-m-20'], {
  variants: {
    level: {
      '1': 'text-4xl font-extrabold lg:text-5xl tracking-tight',
      '2': 'pb-5 text-3xl font-bold first:mt-0 tracking-tight',
      '3': 'pb-5 text-2xl font-bold',
      '4': 'text-xl font-bold',
      '5': 'text-base font-bold',
    },
    font: {
      headline: `${headline.variable} font-headline`,
      inherit: '',
    },
    variant: {
      default: '',
      section: 'text-primary-700 text-4xl',
    },
  },
  defaultVariants: {
    level: '1',
    font: 'headline',
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
  font,
  variant,
  className,
  children,
  ...props
}: HeadlineProps) => {
  const Element = `h${level}` as any;
  return (
    <Element
      className={cn(styles({ level, font, variant, className }))}
      {...props}
    >
      {children}
    </Element>
  );
};

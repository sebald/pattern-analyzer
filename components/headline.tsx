import { cva, VariantProps } from 'class-variance-authority';

// Styles
// ---------------
const styles = cva([], {
  variants: {
    level: {
      '1': 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      '2': 'scroll-m-20 pb-5 text-3xl font-semibold tracking-tight first:mt-0',
      '3': 'scroll-m-20 pb-5 text-2xl font-semibold tracking-tight',
      '4': 'scroll-m-20 text-xl font-semibold tracking-tight',
      '5': 'scroll-m-20 text-base font-semibold tracking-tight',
    },
  },
  defaultVariants: {
    level: '1',
  },
});

// Props
// ---------------
export interface HeadlineProps extends VariantProps<typeof styles> {
  className?: string;
  children?: React.ReactNode;
}

// Component
// ---------------
export const Headline = ({ level, className, children }: HeadlineProps) => {
  const Element = `h${level}` as keyof JSX.IntrinsicElements;
  return <Element className={styles({ level, className })}>{children}</Element>;
};

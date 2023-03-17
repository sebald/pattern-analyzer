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
    size: {
      regular: '',
      large: 'text-lg',
    },
    prose: {
      true: 'prose',
    },
  },
  defaultVariants: {
    space: 'default',
    size: 'regular',
    prose: false,
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
export const Text = ({
  as = 'p',
  space,
  size,
  prose,
  className,
  children,
}: TextProps) => {
  const Element = as as keyof JSX.IntrinsicElements;
  return (
    <Element className={styles({ space, size, prose, className })}>
      {children}
    </Element>
  );
};

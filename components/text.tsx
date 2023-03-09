import { cva, VariantProps } from 'class-variance-authority';

// Styles
// ---------------
const styles = cva(['leading-6 [&:not(:last-child)]:pb-6']);

// Props
// ---------------
export interface TextProps extends VariantProps<typeof styles> {
  children?: React.ReactNode;
  as?: 'p' | 'span';
}

// Component
// ---------------
export const Text = ({ as = 'p', children }: TextProps) => {
  const Element = as as keyof JSX.IntrinsicElements;
  return <Element className={styles()}>{children}</Element>;
};

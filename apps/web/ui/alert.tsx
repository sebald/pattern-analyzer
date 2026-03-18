import { cva, VariantProps } from 'class-variance-authority';

// Title
// ---------------
export interface AlertTitleProps {
  children: React.ReactNode;
}

const AlertTitle = ({ children }: AlertTitleProps) => (
  <div className="text-sm font-semibold leading-6">{children}</div>
);

// Styles
// ---------------
const styles = cva(['rounded-lg py-2 px-4 text-xs'], {
  variants: {
    variant: {
      info: ['bg-sky-100 border border-sky-200 text-sky-900'],
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

// Props
// ---------------
export interface AlertProps extends VariantProps<typeof styles> {
  children: React.ReactNode;
}

// Component
// ---------------
export const Alert = ({ children, variant }: AlertProps) => (
  <div className={styles({ variant })}>{children}</div>
);

Alert.Title = AlertTitle;

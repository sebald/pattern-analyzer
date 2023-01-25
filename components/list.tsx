import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

// Styles
// ---------------
const styles = {
  item: cva([], {
    variants: {
      variant: {
        default: 'py-6 first:pt-3 last:pb-3',
        compact: 'py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }),
};

// List.Item
// ---------------
export interface ListItemProps
  extends VariantProps<typeof styles.item>,
    React.ComponentPropsWithoutRef<'li'> {
  children: React.ReactNode;
}

export const ListItem = ({ children, variant, className }: ListItemProps) => (
  <li className={styles.item({ variant, className })}>{children}</li>
);

// Props
// ---------------
export interface ListProps
  extends VariantProps<typeof styles.item>,
    React.ComponentPropsWithoutRef<'li'> {
  children: React.ReactNode;
}

// Component
// ---------------
export const List = ({ variant = 'default', children }: ListProps) => (
  <ul className="divide-y divide-secondary-100">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { variant, ...child.props });
      }
      return child;
    })}
  </ul>
);

List.Item = ListItem;

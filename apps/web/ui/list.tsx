import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

// Styles
// ---------------
const styles = {
  list: cva([], {
    variants: {
      enumeration: {
        default: 'divide-y divide-secondary-100',
        enum: 'list-disc pl-4',
        decimal: 'list-decimal pl-4',
      },
    },
    defaultVariants: {
      enumeration: 'default',
    },
  }),
  item: cva([], {
    variants: {
      variant: {
        default: 'py-2',
        compact: 'py-1',
        spread: 'py-4',
        wide: 'py-6 first:pt-3 last:pb-3',
        complex: 'px-4 md:px-6 py-5',
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
  extends VariantProps<typeof styles.list>,
    VariantProps<typeof styles.item>,
    React.ComponentPropsWithoutRef<'li'> {
  children: React.ReactNode;
}

// Component
// ---------------
export const List = ({
  variant = 'default',
  enumeration,
  className,
  children,
}: ListProps) => {
  const Element = enumeration === 'decimal' ? 'ol' : 'ul';

  return (
    <Element className={styles.list({ enumeration, className })}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            variant,
            ...child.props,
          });
        }
        return child;
      })}
    </Element>
  );
};

List.Item = ListItem;

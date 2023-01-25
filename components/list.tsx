'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { createContext, useContext } from 'react';

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

// Provider
// ---------------
const Context = createContext<VariantProps<typeof styles.item>>({
  variant: 'default',
});
const useListContext = () => useContext(Context);

// List.Item
// ---------------
export interface ListItemProps extends React.ComponentPropsWithoutRef<'li'> {
  children: React.ReactNode;
}

export const ListItem = ({ children, className }: ListItemProps) => {
  const { variant } = useListContext();
  return <li className={styles.item({ variant, className })}>{children}</li>;
};

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
    <Context.Provider value={{ variant }}>{children}</Context.Provider>
  </ul>
);

List.Item = ListItem;

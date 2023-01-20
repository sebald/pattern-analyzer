// List.Item
// ---------------
export interface ListItemProps extends React.ComponentPropsWithoutRef<'li'> {
  children: React.ReactNode;
}

export const ListItem = ({ children }: ListItemProps) => (
  <li className="py-3">{children}</li>
);

// Props
// ---------------
export interface ListProps extends React.ComponentPropsWithoutRef<'li'> {
  children: React.ReactNode;
}

// Component
// ---------------
export const List = ({ children }: ListProps) => (
  <ul className="divide-y divide-secondary-100">{children}</ul>
);

List.Item = ListItem;

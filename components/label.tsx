export interface LabelProps extends React.ComponentPropsWithRef<'label'> {
  children: React.ReactNode;
}

export const Label = ({ children, ...props }: LabelProps) => (
  <label
    {...props}
    className="mb-1 block text-sm font-medium text-secondary-700"
  >
    {children}
  </label>
);

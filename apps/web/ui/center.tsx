export interface CenterProps {
  children: React.ReactNode;
}

export const Center = ({ children }: CenterProps) => (
  <div className="mx-auto max-w-md">{children}</div>
);

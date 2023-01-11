export interface CardProps {
  children: React.ReactNode;
}

export const Card = ({ children }: CardProps) => (
  <div className="mx-auto rounded-lg bg-white shadow">
    <div className="p-4">{children}</div>
  </div>
);

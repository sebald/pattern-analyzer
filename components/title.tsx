export interface TitleProps {
  children: React.ReactNode;
}

export const Title = ({ children }: TitleProps) => (
  <h1 className="text-2xl font-bold tracking-tight text-primary-700 sm:text-4xl">
    {children}
  </h1>
);

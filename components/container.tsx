export interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => (
  <div className="mx-auto w-[min(100%_-_2rem,_75rem)]">{children}</div>
);

export interface TilesProps {
  children: React.ReactNode;
}

export const Tiles = ({ children }: TilesProps) => (
  <h1 className="grid grid-cols-[repeat(auto-fit,_minmax(min(250px,_100%),_1fr))] gap-2">
    {children}
  </h1>
);

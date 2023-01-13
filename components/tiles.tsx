export interface TilesProps {
  children: React.ReactNode;
}

export const Tiles = ({ children }: TilesProps) => (
  <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(250px,_100%),_1fr))] justify-items-stretch gap-6">
    {children}
  </div>
);

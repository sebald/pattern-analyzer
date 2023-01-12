export interface CaptionProps {
  children: React.ReactNode;
}

export const Caption = ({ children }: CaptionProps) => (
  <h1 className="text-sm text-primary-300">{children}</h1>
);

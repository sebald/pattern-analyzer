export interface CaptionProps {
  children: React.ReactNode;
}

export const Caption = ({ children }: CaptionProps) => (
  <h6 className="pt-1 text-sm text-primary-400">{children}</h6>
);

export interface CaptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Caption = ({ children, className }: CaptionProps) => (
  <h6 className={`pt-1 text-sm text-primary-400 ${className}`}>{children}</h6>
);

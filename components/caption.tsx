// Props
// ---------------
export interface CaptionProps {
  children: React.ReactNode;
}

// Components
// ---------------
export const Caption = ({ children }: CaptionProps) => (
  <h6 className="text-sm text-primary-300">{children}</h6>
);

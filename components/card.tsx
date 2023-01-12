// Card.Body
// ---------------
export interface CardBodyProps {
  children: React.ReactNode;
}

const CardBody = ({ children }: CardBodyProps) => (
  <div className="flex-1">{children}</div>
);

// Card.Footer
// ---------------
export interface CardFooterProps {
  children: React.ReactNode;
}

const CardFooter = ({ children }: CardFooterProps) => (
  <div className="border-t border-secondary-100 text-center">{children}</div>
);

// Card
// ---------------
export interface CardProps {
  children: React.ReactNode;
}

export const Card = ({ children }: CardProps) => (
  <div className="mx-auto flex flex-col gap-4 rounded-lg bg-white px-4 pt-3 pb-2 shadow">
    {children}
  </div>
);

Card.Body = CardBody;
Card.Footer = CardFooter;

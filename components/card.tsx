// Card.Title
// ---------------
export interface CardTitleProps {
  children: React.ReactNode;
}

const CardTitle = ({ children }: CardTitleProps) => (
  <div className="text-center text-lg font-bold">{children}</div>
);

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
  <div className="border-t border-secondary-100">{children}</div>
);

// Card
// ---------------
export interface CardProps {
  children: React.ReactNode;
}

export const Card = ({ children }: CardProps) => (
  <div className="flex h-full w-full flex-col items-stretch gap-4 rounded-lg bg-white px-3 pt-3 pb-2 shadow shadow-secondary-200">
    {children}
  </div>
);

Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

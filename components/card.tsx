import { cva, VariantProps } from 'class-variance-authority';

// Styles
// ---------------
const styles = {
  card: cva(
    ['flex h-full w-full flex-col items-stretch gap-4', 'rounded-lg bg-white'],
    {
      variants: {
        variant: {
          default: ['shadow-card'],
        },
        inset: {
          default: ['px-3 pt-3 pb-2'],
        },
      },
      defaultVariants: {
        variant: 'default',
        inset: 'default',
      },
    }
  ),
};

// Card.Title
// ---------------
export interface CardTitleProps {
  children: React.ReactNode;
}

const CardTitle = ({ children }: CardTitleProps) => (
  <div className="text-center text-lg font-bold">{children}</div>
);

// Card.Header
// ---------------
export interface CardHeaderProps {
  children: React.ReactNode;
}

const CardHeader = ({ children }: CardHeaderProps) => (
  <div className="relative flex flex-col gap-3">{children}</div>
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

// Card.Menu
// ---------------
export interface CardMenuProps {
  children: React.ReactNode;
}

const CardMenu = ({ children }: CardMenuProps) => (
  <div className="absolute top-0 right-1">{children}</div>
);

// Card.Action
// ---------------
export interface CardActionsProps {
  children: React.ReactNode;
}

const CardActions = ({ children }: CardActionsProps) => (
  <div className="flex justify-end gap-3 pb-1">{children}</div>
);

// Card
// ---------------
export interface CardProps extends VariantProps<typeof styles.card> {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ variant, inset, className, children }: CardProps) => (
  <div className={styles.card({ variant, inset, className })}>{children}</div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Menu = CardMenu;
Card.Actions = CardActions;

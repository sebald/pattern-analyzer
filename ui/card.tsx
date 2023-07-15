import { ComponentPropsWithoutRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/classname.utils';

// Styles
// ---------------
const styles = {
  card: cva(
    ['flex h-full w-full flex-col items-stretch gap-4', 'rounded-lg bg-white'],
    {
      variants: {
        elevation: {
          default: ['shadow-card'],
          lightest: ['shadow-sm'],
          light: ['shadow'],
        },
        inset: {
          default: ['px-3 pt-3 pb-2'],
          headless: ['px-3 pt-4 pb-2'], // No title/card.header
        },
      },
      defaultVariants: {
        elevation: 'default',
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
  <div className="text-center text-lg font-bold md:text-xl">{children}</div>
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
  <div className="absolute right-1 top-0">{children}</div>
);

// Card.Action
// ---------------
export interface CardActionsProps {
  children: React.ReactNode;
}

const CardActions = ({ children }: CardActionsProps) => (
  <div className="flex flex-wrap justify-end gap-3 pb-1">{children}</div>
);

// Card
// ---------------
export interface CardProps
  extends VariantProps<typeof styles.card>,
    ComponentPropsWithoutRef<'div'> {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({
  elevation: variant,
  inset,
  className,
  children,
  ...props
}: CardProps) => (
  <div
    {...props}
    className={cn(styles.card({ elevation: variant, inset, className }))}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Menu = CardMenu;
Card.Actions = CardActions;

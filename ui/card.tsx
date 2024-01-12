import { ComponentPropsWithoutRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/classname.utils';

// Styles
// ---------------
const styles = {
  card: cva(
    ['flex w-full flex-col items-stretch gap-4', 'rounded-lg bg-white'],
    {
      variants: {
        elevation: {
          default: 'shadow-card',
          lightest: 'shadow-sm',
          light: 'shadow',
        },
        inset: {
          default: 'px-3 pt-3 pb-2',
          headless: 'px-3 py-4', // No title/card.header
          none: 'p-0', // when using a list
        },
        size: {
          stretch: 'h-full',
          fit: 'h-fit',
        },
      },
      defaultVariants: {
        elevation: 'default',
        inset: 'default',
        size: 'stretch',
      },
    }
  ),
  body: cva('flex-1', {
    variants: {
      variant: {
        enumeration: 'divide-y divide-secondary-100',
      },
    },
  }),
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
export interface CardBodyProps extends VariantProps<typeof styles.body> {
  children: React.ReactNode;
  className?: string;
}

const CardBody = ({ variant, children, className }: CardBodyProps) => (
  <div className={cn(styles.body({ variant }), className)}>{children}</div>
);

// Card.Footer
// ---------------
export interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const CardFooter = ({ className, children }: CardFooterProps) => (
  <div className={cn('border-t border-secondary-100', className)}>
    {children}
  </div>
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
  className?: string;
  children: React.ReactNode;
}

const CardActions = ({ className, children }: CardActionsProps) => (
  <div className={cn('flex flex-wrap justify-end gap-3 pb-1', className)}>
    {children}
  </div>
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
  elevation,
  inset,
  size,
  className,
  children,
  ...props
}: CardProps) => (
  <div
    {...props}
    className={cn(styles.card({ elevation, inset, size }), className)}
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

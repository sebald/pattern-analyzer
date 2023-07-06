'use client';

import * as React from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Close } from '@/ui/icons';

// Styles
// ---------------
const styles = {
  content: cva(
    'fixed z-50 bg-white p-6 shadow-lg shadow-black/30 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
    {
      variants: {
        side: {
          top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
          bottom:
            'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
          right:
            'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
        },
      },
      defaultVariants: {
        side: 'right',
      },
    }
  ),
};

// Sheet.Trigger
// ---------------
const SheetTrigger = Primitive.Trigger;

// Sheet.Close
// ---------------
const SheetClose = Primitive.Close;

// Sheet.Portal
// ---------------
const SheetPortal = ({ className, ...props }: Primitive.DialogPortalProps) => (
  <Primitive.Portal className={cn(className)} {...props} />
);
SheetPortal.displayName = Primitive.Portal.displayName;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Primitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof Primitive.Overlay>
>(({ className, ...props }, ref) => (
  <Primitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-slate-200/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = Primitive.Overlay.displayName;

// Sheet.Content
// ---------------
interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof Primitive.Content>,
    VariantProps<typeof styles.content> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Primitive.Content
      ref={ref}
      className={cn(styles.content({ side }), className)}
      {...props}
    >
      {children}
      <Primitive.Close className="ring-offset-background focus:ring-ring absolute right-5 top-5 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary-100">
        <Close className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </Primitive.Close>
    </Primitive.Content>
  </SheetPortal>
));
SheetContent.displayName = Primitive.Content.displayName;

// Sheet.Header
// ---------------
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

// Sheet.Footer
// ---------------
const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

// Sheet.Title
// ---------------
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof Primitive.Title>,
  React.ComponentPropsWithoutRef<typeof Primitive.Title>
>(({ className, ...props }, ref) => (
  <Primitive.Title
    ref={ref}
    className={cn('text-foreground text-lg font-semibold', className)}
    {...props}
  />
));
SheetTitle.displayName = Primitive.Title.displayName;

// Sheet.Description
// ---------------
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof Primitive.Description>,
  React.ComponentPropsWithoutRef<typeof Primitive.Description>
>(({ className, ...props }, ref) => (
  <Primitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
SheetDescription.displayName = Primitive.Description.displayName;

// Sheet
// ---------------
export const Sheet = (props: Primitive.DialogProps) => (
  <Primitive.Root {...props}></Primitive.Root>
);

Sheet.Trigger = SheetTrigger;
Sheet.Close = SheetClose;
Sheet.Content = SheetContent;
Sheet.Header = SheetHeader;
Sheet.Footer = SheetFooter;
Sheet.Title = SheetTitle;
Sheet.Description = SheetDescription;

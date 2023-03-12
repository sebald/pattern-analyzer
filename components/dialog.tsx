'use client';
// Based on the awesome https://ui.shadcn.com/ ❤️
import { forwardRef } from 'react';
import * as Primitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';
import { Close } from './icons';

// Portal
// ---------------
const DialogPortal = ({
  className,
  children,
  ...props
}: Primitive.DialogPortalProps) => (
  <Primitive.Portal {...props}>
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  </Primitive.Portal>
);

// Overlay
// ---------------
const DialogOverlay = forwardRef<
  React.ElementRef<typeof Primitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof Primitive.Overlay>
>(({ className, children, ...props }, ref) => (
  <Primitive.Overlay
    className={cn(
      'animate-in fade-in fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity',
      className
    )}
    {...props}
    ref={ref}
  />
));
DialogOverlay.displayName = Primitive.Overlay.displayName;

// Content
// ---------------
const DialogContent = forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <Primitive.Content
      ref={ref}
      className={cn(
        'border border-secondary-100 bg-white px-4 py-3 shadow shadow-secondary-600 sm:max-w-lg sm:rounded-lg',
        'animate-in fade-in-90 slide-in-from-bottom-10 sm:zoom-in-90 sm:slide-in-from-bottom-0 fixed z-50 grid w-full scale-100 gap-2 opacity-100',
        className
      )}
      {...props}
    >
      {children}
      <Primitive.Close
        className={cn(
          'absolute top-4 right-4 rounded-sm opacity-70 transition-opacity',
          'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 disabled:pointer-events-none',
          'data-[state=open]:bg-secondary-100'
        )}
      >
        <Close className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </Primitive.Close>
    </Primitive.Content>
  </DialogPortal>
));
DialogContent.displayName = Primitive.Content.displayName;

// Header
// ---------------
const DialogHeader = ({
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
DialogHeader.displayName = 'DialogHeader';

// Footer
// ---------------
const DialogFooter = ({
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
DialogFooter.displayName = 'DialogFooter';

// Title
// ---------------
const DialogTitle = forwardRef<
  React.ElementRef<typeof Primitive.Title>,
  React.ComponentPropsWithoutRef<typeof Primitive.Title>
>(({ className, ...props }, ref) => (
  <Primitive.Title
    ref={ref}
    className={cn('text-xl font-bold text-primary-900', className)}
    {...props}
  />
));
DialogTitle.displayName = Primitive.Title.displayName;

// Description
// ---------------
const DialogDescription = forwardRef<
  React.ElementRef<typeof Primitive.Description>,
  React.ComponentPropsWithoutRef<typeof Primitive.Description>
>(({ className, ...props }, ref) => (
  <Primitive.Description
    ref={ref}
    className={cn('text-sm text-secondary-500', className)}
    {...props}
  />
));
DialogDescription.displayName = Primitive.Description.displayName;

// Export Dialog
// ---------------
export const Dialog = (props: Primitive.DialogProps) => (
  <Primitive.Root {...props}></Primitive.Root>
);
Dialog.Trigger = Primitive.Trigger;
Dialog.Portal = DialogPortal;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

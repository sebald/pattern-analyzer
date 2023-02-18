import { cva, VariantProps } from 'class-variance-authority';
import { Info } from './icons';

// Message.Title
// ---------------
export interface MessageTitleProps {
  children: React.ReactNode;
}

const MessageTitle = ({ children }: MessageTitleProps) => (
  <div className="font-semibold leading-6">{children}</div>
);

// Message.Action
// ---------------
export interface MessageActionProps
  extends React.ComponentPropsWithRef<'button'> {
  children: React.ReactNode;
}

const MessageAction = ({
  children,
  type = 'button',
  ...props
}: MessageActionProps) => (
  <button
    {...props}
    type={type}
    className="inline-block font-bold leading-loose"
  >
    {children}
  </button>
);

// Message.Footer
// ---------------
export interface MessageFooterProps {
  children: React.ReactNode;
}

const MessageFooter = ({ children }: MessageFooterProps) => (
  <div className="mt-2 flex space-x-4">{children}</div>
);

// Styles
// ---------------
const styles = cva(['flex gap-1 rounded-md p-4'], {
  variants: {
    variant: {
      info: 'bg-blue-200 text-blue-500',
      error: 'bg-red-200 text-red-500',
    },
    size: {
      regular: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'regular',
  },
});

// Props
// ---------------
export interface InfoProps extends VariantProps<typeof styles> {
  children: React.ReactNode;
}

// COmponent
// ---------------
export const Message = ({ variant, size, children }: InfoProps) => (
  <div className={styles({ variant, size })}>
    <Info className="h-6 w-6 flex-shrink-0" />
    <div>{children}</div>
  </div>
);

Message.Title = MessageTitle;
Message.Action = MessageAction;
Message.Footer = MessageFooter;

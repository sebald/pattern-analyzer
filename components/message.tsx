import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';
import cn from 'clsx';

// Message.Action
// ---------------
export interface MessageActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
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
const styles = cva(['flex rounded-md p-4 text-sm'], {
  variants: {
    variant: {
      info: 'bg-blue-200 text-blue-500',
      error: 'bg-red-200 text-red-500',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export interface InfoProps extends VariantProps<typeof styles> {
  children: React.ReactNode;
}

export const Message = ({ variant = 'info', children }: InfoProps) => (
  <div className={styles({ variant })}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="mr-3 h-5 w-5 flex-shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
    <div>{children}</div>
  </div>
);

Message.Action = MessageAction;
Message.Footer = MessageFooter;

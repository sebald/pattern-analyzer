import { Link, Message } from '@/ui';

export const StatsHint = () => (
  <Message align="center">
    <Message.Title>
      For information about some commonly used terms, see the &quot;About the
      Data&quot; secion on the{' '}
      <Link className="underline underline-offset-2" href="/about">
        About page
      </Link>
      .
    </Message.Title>
  </Message>
);

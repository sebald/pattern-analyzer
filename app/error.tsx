'use client';

import { Message } from '@/ui';

export interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => (
  <div className="grid flex-1 place-items-center">
    <Message variant="error">
      <Message.Title>Whoopsie, something went wrong!</Message.Title>
      {error.message}
      <Message.Footer>
        <Message.Button onClick={reset}>Retry</Message.Button>
      </Message.Footer>
    </Message>
  </div>
);

export default Error;

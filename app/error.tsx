'use client';

import { Message } from 'components';

export interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => (
  <div className="grid min-h-screen place-items-center">
    <Message variant="error">
      <Message.Title>Whoopsie, something went wrong!</Message.Title>
      {error.message}
      <Message.Footer>
        <Message.Action onClick={reset}>Retry</Message.Action>
      </Message.Footer>
    </Message>
  </div>
);

export default Error;

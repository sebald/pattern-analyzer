'use client';

import { Input, Button } from 'components';
import { useRouter } from 'next/navigation';
import { FormEventHandler } from 'react';

export const EventForm = () => {
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const event = data.get('event');
    if (event) {
      router.push(`/${event}`);
    }
  };

  return (
    <form className="flex gap-3" onSubmit={handleSubmit}>
      <Input name="event" size="large" />
      <Button variant="primary" size="large" type="submit">
        Submit
      </Button>
    </form>
  );
};

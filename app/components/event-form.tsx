'use client';

import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { Input, Button } from 'components';

export const EventForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    const data = new FormData(e.target as HTMLFormElement);
    const event = data.get('event');

    if (event) {
      router.push(`/${event}`);
      return;
    }

    setError('Please enter a even ID first.');
  };

  const handleChange = useDebouncedCallback((val: string) => {
    if (/^[0-9]*$/.test(val)) {
      setError(null);
      return;
    }

    setError('Invalid ID. Please only use numbers.');
  }, 200);

  return (
    <form className="flex items-start gap-3" onSubmit={handleSubmit}>
      <Input
        placeholder="Longshank Event ID"
        name="event"
        size="large"
        onChange={e => handleChange(e.target.value)}
        error={error}
      />
      <Button variant="primary" size="large" type="submit">
        Submit
      </Button>
    </form>
  );
};

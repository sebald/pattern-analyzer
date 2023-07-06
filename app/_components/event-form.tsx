'use client';

import { FormEventHandler, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { Input, Button, Select, Spinner } from '@/ui';

export const EventForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    const data = new FormData(e.target as HTMLFormElement);
    const vendor = data.get('vendor');
    const event = data.get('event');

    if (!event) {
      setError('Please enter an event ID.');
      return;
    }

    startTransition(() => {
      push(`/event/${vendor}/${event}`);
    });
  };

  const handleChange = useDebouncedCallback((val: string) => {
    if (/^[0-9]*$/.test(val)) {
      setError(null);
      return;
    }

    setError('Invalid ID. Please only use numbers.');
  }, 200);

  return (
    <form
      className="flex flex-col justify-center gap-3 md:flex-row"
      onSubmit={handleSubmit}
    >
      <Select
        name="vendor"
        size="large"
        className="w-full"
        defaultValue="listfortress"
      >
        <Select.Option value="listfortress">Listfortress</Select.Option>
        <Select.Option value="longshanks">Longshanks</Select.Option>
        <Select.Option value="rollbetter">Rollbetter</Select.Option>
      </Select>
      <Input
        placeholder="Event ID"
        name="event"
        size="large"
        onChange={e => handleChange(e.target.value)}
        error={error}
        inputMode="numeric"
        autoFocus
      />
      <Button variant="primary" size="large" type="submit">
        {pending ? <Spinner className="h-6 w-6" /> : 'Submit'}
      </Button>
    </form>
  );
};

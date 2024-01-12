'use client';

import { useState } from 'react';

import { vendors } from '@/lib/config';
import type { Vendor } from '@/lib/types';

import { Input, Link, Select } from '@/ui';

export const SearchForm = () => {
  const [vendor, setVendor] = useState<Vendor>('listfortress');
  const [id, setId] = useState('');

  return (
    <div className="flex">
      <Select
        name="vendor"
        size="large"
        onChange={e => setVendor(e.target.value as Vendor)}
      >
        {vendors.map(({ id, name }) => (
          <Select.Option key={id} value={vendor}>
            {name}
          </Select.Option>
        ))}
      </Select>
      <Input
        placeholder="Event ID"
        name="event"
        size="large"
        value={id}
        onChange={e => setId(e.target.value)}
        inputMode="numeric"
        htmlSize={6}
      />
      <Link variant="button" size="large" href={`/event/${vendor}/${id}`}>
        Go to
      </Link>
    </div>
  );
};

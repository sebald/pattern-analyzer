'use client';

import { useState } from 'react';

import { vendors } from '@/lib/config';
import type { Vendor } from '@/lib/types';

import { Input, Link, Select } from '@/ui';

export const SearchForm = () => {
  const [vendor, setVendor] = useState<Vendor>('listfortress');
  const [id, setId] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <div className="font-medium">View Tournament:</div>
      <div className="flex gap-4">
        <Select
          name="vendor"
          variant="flat"
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
          variant="flat"
          size="large"
          value={id}
          onChange={e => setId(e.target.value)}
          inputMode="numeric"
          htmlSize={6}
        />
        <Link variant="cta" size="large" href={`/event/${vendor}/${id}`}>
          View
        </Link>
      </div>
    </div>
  );
};

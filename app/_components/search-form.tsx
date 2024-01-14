'use client';

import { useState } from 'react';

import { vendors } from '@/lib/config';
import type { Vendor } from '@/lib/types';

import { Card, Input, Link, Select } from '@/ui';
import { Trophy } from '@/ui/icons';

export const SearchForm = () => {
  const [vendor, setVendor] = useState<Vendor>('listfortress');
  const [id, setId] = useState('');

  return (
    <div className="flex flex-col gap-x-4 gap-y-2 sm:flex-row">
      <Card
        inset="none"
        className="flex-row gap-0 divide-x divide-secondary-200"
      >
        <Input
          placeholder="Event ID"
          name="event"
          variant="transparent"
          size="large"
          className="rounded-l-lg"
          value={id}
          onChange={e => setId(e.target.value)}
          inputMode="numeric"
        />
        <Select
          name="vendor"
          variant="transparent"
          size="large"
          className="rounded-r-lg"
          onChange={e => setVendor(e.target.value as Vendor)}
        >
          {vendors.map(({ id, name }) => (
            <Select.Option key={id} value={vendor}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Card>
      <Link
        variant="cta"
        size="large"
        className="flex items-center justify-center gap-1"
        href={`/tournament/${vendor}/${id}`}
      >
        <Trophy className="size-4" /> View
      </Link>
    </div>
  );
};

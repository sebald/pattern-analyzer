'use client';

import { Disclosure, Select } from 'components';
import { getAllFactions } from 'lib/data';

export const Filter = () => (
  <Disclosure summary="Filter">
    <Select label="Faction">
      <Select.Option>All Factions</Select.Option>
      {getAllFactions().map(({ id, name }) => (
        <Select.Option key={id} value={id}>
          {name}
        </Select.Option>
      ))}
    </Select>
  </Disclosure>
);

'use client';

import { Disclosure, Select } from 'components';
import { getAllFactions } from 'lib/data';
import { FactionOptions, useFilter } from './filter-context';

export const Filter = () => {
  const filter = useFilter();
  return (
    <Disclosure summary="Filter">
      <Select
        label="Faction"
        value={filter.faction}
        onChange={e => filter.setFaction(e.target.value as FactionOptions)}
      >
        <Select.Option value="all">All Factions</Select.Option>
        {getAllFactions().map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </Disclosure>
  );
};

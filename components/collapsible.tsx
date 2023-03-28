'use client';

import { useState } from 'react';

export interface CollapsibleProps {
  defaultCollapsed?: boolean;
  height: string;
  children: React.ReactNode;
}

export const Collapsible = ({
  defaultCollapsed = true,
  height,
  children,
}: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
};

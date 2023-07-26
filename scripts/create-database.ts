#!/usr/bin/env tsx
import 'zx/globals';

void (async () => {
  await $`ls -la`;
})();

'use client';

import { Button, Dialog } from 'components';

export const AboutParsingDialog = () => (
  <Dialog>
    <Dialog.Trigger asChild>
      <Button
        className="opacity-75 hover:opacity-100"
        variant="link"
        size="inherit"
      >
        (?)
      </Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>About Parsing Squads</Dialog.Title>
      </Dialog.Header>
      <div className="py-2">
        <p className="prose pb-4">
          <em>Pattern Analyzer</em> acquires all data from a certain vendor
          (e.g. Longshanks) and tries to interpret it to the best of its
          ability.
        </p>
        <p className="prose">
          Parsing user generated data (like squad lists) is hard though and
          extracting information might not be possible all the time. When this
          happens the raw user input will be displayed as squad. It also
          won&apos;t be considered in the event stats.
        </p>
      </div>
    </Dialog.Content>
  </Dialog>
);

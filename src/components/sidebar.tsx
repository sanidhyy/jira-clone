import { Suspense } from 'react';

import { DottedSeparator } from './dotted-separator';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { Projects } from './projects';
import { WorkspaceSwitcher } from './workspaces-switcher';

export const Sidebar = () => {
  return (
    <aside className="size-full bg-neutral-100 p-4">
      <Logo />

      <DottedSeparator className="my-4" />

      <Suspense>
        <WorkspaceSwitcher />
      </Suspense>

      <DottedSeparator className="my-4" />

      <Navigation />

      <DottedSeparator className="my-4" />

      <Suspense>
        <Projects />
      </Suspense>
    </aside>
  );
};

import type { PropsWithChildren } from 'react';

import { Logo } from '@/components/logo';
import { SourceCode } from '@/components/source-code';
import { UserButton } from '@/features/auth/components/user-button';

const StandaloneLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl px-4">
        <nav className="flex h-[73px] items-center justify-between">
          <Logo />

          <div className="flex items-center gap-x-2.5">
            <UserButton />

            <SourceCode />
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center py-4">{children}</div>
      </div>
    </main>
  );
};
export default StandaloneLayout;

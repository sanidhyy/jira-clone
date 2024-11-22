'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { Logo } from '@/components/logo';
import { SourceCode } from '@/components/source-code';
import { Button } from '@/components/ui/button';

const AuthLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isSignIn = pathname === '/sign-in';

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-x-2.5">
            <Button variant="secondary" asChild>
              <Link href={isSignIn ? '/sign-up' : 'sign-in'}>{isSignIn ? 'Register' : 'Login'}</Link>
            </Button>

            <SourceCode />
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center p-4 md:pt-14">{children}</div>
      </div>
    </main>
  );
};

export default AuthLayout;

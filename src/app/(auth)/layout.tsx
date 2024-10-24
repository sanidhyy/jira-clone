'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';

const AuthLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isSignIn = pathname === '/sign-in';

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src="/logo.svg" alt="Logo" height={56} width={152} />

          <Button variant="secondary" asChild>
            <Link href={isSignIn ? '/sign-up' : 'sign-in'}>{isSignIn ? 'Register' : 'Login'}</Link>
          </Button>
        </nav>

        <div className="flex flex-col items-center justify-center p-4 md:pt-14">{children}</div>
      </div>
    </main>
  );
};

export default AuthLayout;
